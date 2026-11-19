import { useState } from 'react';
import { CalendarDays, Clock3, Pencil, Check } from 'lucide-react';

interface DateTimePickerProps {
  value?: string | Date | null;
  onChange: (isoString: string) => void;
  disabled?: boolean;
}

const pad = (value: number) => String(value).padStart(2, '0');
const localDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export function DateTimePicker({ value, onChange, disabled = false }: DateTimePickerProps) {
  const parsed = value ? new Date(value) : new Date();
  const selected = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  const [editingDate, setEditingDate] = useState(false);
  const [editingTime, setEditingTime] = useState(false);
  const date = localDate(selected);
  const hour = pad(selected.getHours());
  const minute = pad(selected.getMinutes());

  const change = (newDate: string, newHour: string, newMinute: string) => {
    if (!newDate) return;
    const updated = new Date(`${newDate}T${newHour}:${newMinute}:00`);
    if (!Number.isNaN(updated.getTime()) &&
        localDate(updated) === newDate &&
        pad(updated.getHours()) === newHour &&
        pad(updated.getMinutes()) === newMinute) {
      onChange(updated.toISOString());
    }
  };

  const inputStyle = 'h-14 w-full min-w-0 rounded-xl border border-teal-200 bg-white px-3 text-base font-semibold text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10';
  const pencilStyle = 'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-teal-600';

  return (
    <section aria-label="Care schedule" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Schedule</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Due date &amp; time</h3>
          <p className="mt-1 text-sm text-slate-500">Select each pencil to edit. Time uses a 24-hour clock.</p>
        </div>
        <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
          <CalendarDays className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <CalendarDays className="h-4 w-4" aria-hidden="true" /> Due date
            </span>
            {!disabled && (
              <button type="button" className={pencilStyle} aria-label={editingDate ? 'Finish editing due date' : 'Edit due date'}
                onClick={() => setEditingDate(value => !value)}>
                {editingDate ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </button>
            )}
          </div>
          {editingDate && !disabled ? (
            <input aria-label="Due date" type="date" value={date}
              onChange={event => change(event.target.value, hour, minute)}
              className={inputStyle} />
          ) : (
            <p className="flex min-h-14 items-center text-lg font-semibold text-slate-900">
              {selected.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>

        <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Clock3 className="h-4 w-4" aria-hidden="true" /> Due time
            </span>
            {!disabled && (
              <button type="button" className={pencilStyle} aria-label={editingTime ? 'Finish editing due time' : 'Edit due time'}
                onClick={() => setEditingTime(value => !value)}>
                {editingTime ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </button>
            )}
          </div>
          {editingTime && !disabled ? (
            <div className="flex items-center gap-2">
              <label className="min-w-0 flex-1">
                <span className="sr-only">Hour (00–23)</span>
                <select aria-label="Hour (00–23)" value={hour}
                  onChange={event => change(date, event.target.value, minute)}
                  className={inputStyle}>
                  {Array.from({ length: 24 }, (_, index) => <option key={index} value={pad(index)}>{pad(index)}</option>)}
                </select>
              </label>
              <span className="text-xl font-bold text-slate-500">:</span>
              <label className="min-w-0 flex-1">
                <span className="sr-only">Minute (00–59)</span>
                <select aria-label="Minute (00–59)" value={minute}
                  onChange={event => change(date, hour, event.target.value)}
                  className={inputStyle}>
                  {Array.from({ length: 60 }, (_, index) => <option key={index} value={pad(index)}>{pad(index)}</option>)}
                </select>
              </label>
            </div>
          ) : (
            <p className="flex min-h-14 items-center text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
              {hour}:{minute}
              <span className="ml-3 text-xs font-medium text-slate-500">24h</span>
            </p>
          )}
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">Displayed in your local time zone. Changes are saved with the task.</p>
    </section>
  );
}
