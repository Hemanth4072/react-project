import React, { useMemo, useState } from 'react';
import { Temporal } from '@js-temporal/polyfill';
import ParticipantForm from './components/ParticipantForm';
import TimeOverlapResult from './components/TimeOverlapResult';
import { calculateOverlapSlots, getBestMeetingSuggestions } from './utils/timeUtils';

const STORAGE_KEY = 'smart-timezone-meeting-planner:participants';
const THEME_KEY = 'smart-timezone-meeting-planner:theme';

const demoParticipants = [
  {
    id: crypto.randomUUID(),
    name: 'Ava (NYC)',
    timezone: 'America/New_York',
    workStart: '09:00',
    workEnd: '17:00',
  },
  {
    id: crypto.randomUUID(),
    name: 'Ravi (Bangalore)',
    timezone: 'Asia/Kolkata',
    workStart: '11:00',
    workEnd: '20:00',
  },
  {
    id: crypto.randomUUID(),
    name: 'Emma (London)',
    timezone: 'Europe/London',
    workStart: '08:00',
    workEnd: '16:00',
  },
];

const loadParticipants = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return demoParticipants;

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    // Ignore malformed localStorage and fall back to demo data.
  }
  return demoParticipants;
};

function App() {
  const [participants, setParticipants] = useState(loadParticipants);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(THEME_KEY) === 'dark');

  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  const nowUtc = Temporal.Now.zonedDateTimeISO('UTC');

  const overlapSlots = useMemo(() => calculateOverlapSlots(participants), [participants]);
  const suggestions = useMemo(
    () => getBestMeetingSuggestions(participants, overlapSlots, 3),
    [participants, overlapSlots],
  );

  const persistParticipants = (nextParticipants) => {
    setParticipants(nextParticipants);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextParticipants));
  };

  const addParticipant = () => {
    persistParticipants([
      ...participants,
      {
        id: crypto.randomUUID(),
        name: '',
        timezone: 'UTC',
        workStart: '09:00',
        workEnd: '17:00',
      },
    ]);
  };

  const removeParticipant = (id) => {
    persistParticipants(participants.filter((participant) => participant.id !== id));
  };

  const updateParticipant = (id, key, value) => {
    persistParticipants(
      participants.map((participant) =>
        participant.id === id ? { ...participant, [key]: value } : participant,
      ),
    );
  };

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Smart Timezone Meeting Planner</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Current UTC time: {nowUtc.toString({ smallestUnit: 'minute' })}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </header>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Participants</h2>
            <button
              type="button"
              onClick={addParticipant}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Add Participant
            </button>
          </div>

          <div className="space-y-3">
            {participants.map((participant, index) => (
              <ParticipantForm
                key={participant.id}
                participant={participant}
                index={index}
                onChange={updateParticipant}
                onRemove={removeParticipant}
                canRemove={participants.length > 1}
              />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <TimeOverlapResult
            participants={participants}
            overlapSlots={overlapSlots}
            suggestions={suggestions}
          />
        </section>
      </div>
    </main>
  );
}

export default App;
