import { Temporal } from '@js-temporal/polyfill';

const DEFAULT_TIMEZONES = [
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Australia/Sydney',
];

export const getTimezoneOptions = () => {
  if (typeof Intl.supportedValuesOf === 'function') {
    return Intl.supportedValuesOf('timeZone');
  }
  return DEFAULT_TIMEZONES;
};

export const parseTimeString = (value) => Temporal.PlainTime.from(value);

const minutesSinceMidnight = (plainTime) =>
  plainTime.hour * 60 + plainTime.minute;

// 🧠 Build working intervals for each participant
const buildIntervalsForParticipant = (participant, nowInstant) => {
  const zoneNow = nowInstant.toZonedDateTimeISO(participant.timezone);

  const startTime = parseTimeString(participant.workStart);
  const endTime = parseTimeString(participant.workEnd);

  const crossesMidnight =
    Temporal.PlainTime.compare(endTime, startTime) <= 0;

  return [-1, 0, 1].map((offset) => {
    const localDate = zoneNow.toPlainDate().add({ days: offset });

    const startZoned = localDate
      .toPlainDateTime(startTime)
      .toZonedDateTime(participant.timezone);

    const endDate = crossesMidnight
      ? localDate.add({ days: 1 })
      : localDate;

    const endZoned = endDate
      .toPlainDateTime(endTime)
      .toZonedDateTime(participant.timezone);

    return {
      participantId: participant.id,
      participantName: participant.name,
      timezone: participant.timezone,
      startInstant: startZoned.toInstant(),
      endInstant: endZoned.toInstant(),
      startLocal: startZoned,
      endLocal: endZoned,
    };
  });
};

// 🧠 Merge overlapping intervals
const mergeIntervals = (intervals) => {
  if (!intervals.length) return [];

  const sorted = [...intervals].sort((a, b) =>
    Temporal.Instant.compare(a.startInstant, b.startInstant)
  );

  const merged = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];

    if (
      Temporal.Instant.compare(current.startInstant, last.endInstant) <= 0
    ) {
      if (
        Temporal.Instant.compare(current.endInstant, last.endInstant) > 0
      ) {
        last.endInstant = current.endInstant;
      }
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
};

// 🧠 Duration in minutes
const overlapDurationMinutes = (startInstant, endInstant) =>
  startInstant.until(endInstant, { largestUnit: 'minutes' }).minutes;

// 🔥 FIXED scoring function
const scoreSlot = (slot, participants) => {
  const durationMinutes = overlapDurationMinutes(
    slot.startInstant,
    slot.endInstant
  );

  const midpointNs =
    slot.startInstant.epochNanoseconds +
    (slot.endInstant.epochNanoseconds -
      slot.startInstant.epochNanoseconds) /
      2n;

  const midpoint = Temporal.Instant.fromEpochNanoseconds(midpointNs);

  const averageMiddayDistance =
    participants.reduce((acc, participant) => {
      // ✅ FIX: Convert Instant → ZonedDateTime
      const localMidpoint = midpoint
        .toZonedDateTimeISO(participant.timezone)
        .toPlainTime();

      return (
        acc +
        Math.abs(
          minutesSinceMidnight(localMidpoint) -
            minutesSinceMidnight(Temporal.PlainTime.from('12:00'))
        )
      );
    }, 0) / participants.length;

  return durationMinutes * 10 - averageMiddayDistance;
};

// 🧠 Calculate overlaps
export const calculateOverlapSlots = (participants) => {
  if (!participants.length) return [];

  const now = Temporal.Now.zonedDateTimeISO('UTC').toInstant();

  const allIntervals = participants.map((participant) =>
    buildIntervalsForParticipant(participant, now)
  );

  const rawSlots = [];

  const walk = (index, currentStart, currentEnd) => {
    if (index === allIntervals.length) {
      if (
        Temporal.Instant.compare(currentEnd, currentStart) > 0
      ) {
        rawSlots.push({
          startInstant: currentStart,
          endInstant: currentEnd,
        });
      }
      return;
    }

    allIntervals[index].forEach((interval) => {
      const nextStart =
        Temporal.Instant.compare(
          interval.startInstant,
          currentStart
        ) > 0
          ? interval.startInstant
          : currentStart;

      const nextEnd =
        Temporal.Instant.compare(
          interval.endInstant,
          currentEnd
        ) < 0
          ? interval.endInstant
          : currentEnd;

      if (
        Temporal.Instant.compare(nextEnd, nextStart) > 0
      ) {
        walk(index + 1, nextStart, nextEnd);
      }
    });
  };

  walk(
    0,
    Temporal.Instant.from('1970-01-01T00:00:00Z'),
    Temporal.Instant.from('2100-01-01T00:00:00Z')
  );

  return mergeIntervals(rawSlots);
};

// 🧠 Get best meeting slots
export const getBestMeetingSuggestions = (
  participants,
  slots,
  limit = 3
) => {
  return [...slots]
    .sort(
      (a, b) =>
        scoreSlot(b, participants) -
        scoreSlot(a, participants)
    )
    .slice(0, limit)
    .map((slot) => ({
      ...slot,
      duration: slot.startInstant.until(slot.endInstant, {
        largestUnit: 'hours',
      }),
    }));
};

// 🧠 Format time
export const formatInstantForTimezone = (instant, timezone) => {
  const zoned = instant.toZonedDateTimeISO(timezone);

  return {
    full: zoned.toString({ smallestUnit: 'minute' }),
    time: zoned.toPlainTime().toString({ smallestUnit: 'minute' }),
    date: zoned.toPlainDate().toString(),
    zoned,
  };
};

// 🧠 Format duration
export const formatDuration = (duration) => {
  const rounded = duration.round({ largestUnit: 'hours' });

  const parts = [];
  if (rounded.hours) parts.push(`${rounded.hours}h`);
  if (rounded.minutes || parts.length === 0)
    parts.push(`${rounded.minutes}m`);

  return parts.join(' ');
};