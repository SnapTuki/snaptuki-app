import { CalendarDays, Clock } from 'lucide-react';

interface DateTimePickerProps {
  value?: string | Date | null;
  onChange: (isoString: string) => void;
  disabled?: boolean;
}

// Use the user's local date rather than UTC so picking Today/Tomorrow
// behaves correctly in every time zone.
const toLocalDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export function DateTimePicker({ value, onChange, disabled = false }: DateTimePickerProps) {
  const parsed = value ? new Date(value) : new Date();
  const selected = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  const date = toLocalDate(selected);
  const time = `${String(selected.getHours()).padStart(2, '0')}:${String(selected.getMinutes()).padStart(2, '0')}`;

  const update = (nextDate: string, nextTime: string) => {
    if (!nextDate || !nextTime) return;
    const updated = new Date(`${nextDate}T${nextTime}:00`);
    if (!Number.isNaN(updated.getTime())) {
      onChange(updated.toISOString());
    }
  };

  return (
    <section aria-labelledby="task-schedule-title" className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="mb-5">
        <h3 id="task-schedule-title" className="text-base font-semibold text-slate-900">
          Due date &amp; time
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Choose today, tomorrow, or another date, and set the exact time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block min-w-0">
          <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <CalendarDays className="h-4 w-4 text-teal-700" aria-hidden="true" />
            Date
          </span>
          <input
            type="date"
            value={date}
            disabled={disabled}
            onChange={(event) => update(event.target.value, time)}
            className="block h-16 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 text-lg font-semibold text-slate-900 outline-none transition-colors focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <label className="block min-w-0">
          <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Clock className="h-4 w-4 text-teal-700" aria-hidden="true" />
            Time
          </span>
          <input
            type="time"
            step={60}
            value={time}
            disabled={disabled}
            onChange={(event) => update(date, event.target.value)}
            className="block h-16 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 text-lg font-semibold text-slate-900 outline-none transition-colors focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Times are shown in your local time zone.
      </p>
    </section>
  );
}
