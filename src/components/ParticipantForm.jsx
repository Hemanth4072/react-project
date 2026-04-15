import React from 'react';
import TimezoneSelector from './TimezoneSelector';

function ParticipantForm({ participant, index, onChange, onRemove, canRemove }) {
  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:grid-cols-12">
      <div className="md:col-span-3">
        <label htmlFor={`name-${participant.id}`} className="mb-1 block text-xs font-semibold uppercase text-slate-500">
          Name
        </label>
        <input
          id={`name-${participant.id}`}
          value={participant.name}
          onChange={(event) => onChange(participant.id, 'name', event.target.value)}
          placeholder={`Participant ${index + 1}`}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-indigo-200 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
      </div>

      <div className="md:col-span-4">
        <label htmlFor={`timezone-${participant.id}`} className="mb-1 block text-xs font-semibold uppercase text-slate-500">
          Timezone
        </label>
        <TimezoneSelector
          id={`timezone-${participant.id}`}
          value={participant.timezone}
          onChange={(value) => onChange(participant.id, 'timezone', value)}
        />
      </div>

      <div className="md:col-span-2">
        <label htmlFor={`start-${participant.id}`} className="mb-1 block text-xs font-semibold uppercase text-slate-500">
          Work Start
        </label>
        <input
          id={`start-${participant.id}`}
          type="time"
          value={participant.workStart}
          onChange={(event) => onChange(participant.id, 'workStart', event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-indigo-200 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
      </div>

      <div className="md:col-span-2">
        <label htmlFor={`end-${participant.id}`} className="mb-1 block text-xs font-semibold uppercase text-slate-500">
          Work End
        </label>
        <input
          id={`end-${participant.id}`}
          type="time"
          value={participant.workEnd}
          onChange={(event) => onChange(participant.id, 'workEnd', event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-indigo-200 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
      </div>

      <div className="flex items-end md:col-span-1">
        <button
          type="button"
          onClick={() => onRemove(participant.id)}
          disabled={!canRemove}
          className="w-full rounded-lg border border-rose-300 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/20"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default ParticipantForm;
