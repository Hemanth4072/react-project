import React from 'react';
import { getTimezoneOptions } from '../utils/timeUtils';

const options = getTimezoneOptions();

function TimezoneSelector({ value, onChange, id }) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-indigo-200 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    >
      {options.map((timezone) => (
        <option key={timezone} value={timezone}>
          {timezone}
        </option>
      ))}
    </select>
  );
}

export default TimezoneSelector;
