import React from 'react';
import { formatDuration, formatInstantForTimezone } from '../utils/timeUtils';

function SlotCard({ slot, participants, title }) {
  const utcStart = formatInstantForTimezone(slot.startInstant, 'UTC');
  const utcEnd = formatInstantForTimezone(slot.endInstant, 'UTC');
  const duration = slot.startInstant.until(slot.endInstant, { largestUnit: 'hours' });

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
      <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">{title}</h4>
      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
        <span className="font-medium">UTC:</span> {utcStart.full} → {utcEnd.full}
      </p>
      <p className="text-sm text-slate-700 dark:text-slate-200">
        <span className="font-medium">Duration:</span> {formatDuration(duration)}
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {participants.map((person) => {
          const localStart = formatInstantForTimezone(slot.startInstant, person.timezone);
          const localEnd = formatInstantForTimezone(slot.endInstant, person.timezone);
          return (
            <div
              key={`${person.id}-${title}`}
              className="rounded-lg border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="font-semibold text-slate-800 dark:text-slate-100">{person.name || 'Unnamed participant'}</p>
              <p className="text-slate-600 dark:text-slate-300">{person.timezone}</p>
              <p className="text-slate-600 dark:text-slate-300">
                {localStart.date} {localStart.time} → {localEnd.date} {localEnd.time}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimeOverlapResult({ participants, overlapSlots, suggestions }) {
  if (!participants.length) {
    return null;
  }

  if (!overlapSlots.length) {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        No overlapping working window exists across all participants for the sampled days.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Exact Overlap Windows</h3>
        {overlapSlots.map((slot, index) => (
          <SlotCard key={`overlap-${index + 1}`} slot={slot} participants={participants} title={`Overlap #${index + 1}`} />
        ))}
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Smart Suggestions (Top 3)</h3>
        {suggestions.map((slot, index) => (
          <SlotCard
            key={`suggestion-${index + 1}`}
            slot={slot}
            participants={participants}
            title={`Suggested Slot #${index + 1}`}
          />
        ))}
      </section>
    </div>
  );
}

export default TimeOverlapResult;
