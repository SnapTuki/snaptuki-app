import { CalendarDays, Clock3 } from 'lucide-react';

interface DateTimePickerProps {
  value?: string | Date | null;
  onChange: (isoString: string) => void;
  disabled?: boolean;
}

const pad = (value: number) => String(value).padStart(2, '0');
const localDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/**
 * Always-editable date and time inputs. Hour/minute selects make the 24-hour
 * format explicit regardless of operating-system or browser locale.
 */
export function DateTimePicker({ value, onChange, disabled = false }: DateTimePickerProps) {
  const parsed = value ? new Date(value) : new Date();
  const selected = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
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

  const controlClass = 'h-14 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 text-base font-semibold text-slate-900 outline-none transition-colors focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/10 disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <section aria-label="Care schedule" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex min-w-0 items-center gap-3">
          <CalendarDays className="h-5 w-5 shrink-0 text-teal-700" aria-hidden="true" />
          <input
            aria-label="Due date"
            type="date"
            value={date}
            disabled={disabled}
            onChange={event => change(event.target.value, hour, minute)}
            className={controlClass}
          />
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <Clock3 className="h-5 w-5 shrink-0 text-teal-700" aria-hidden="true" />
          <select
            aria-label="Due hour (24-hour format)"
            value={hour}
            disabled={disabled}
            onChange={event => change(date, event.target.value, minute)}
            className={controlClass}
          >
            {Array.from({ length: 24 }, (_, index) => <option key={index} value={pad(index)}>{pad(index)}</option>)}
          </select>
          <span className="text-xl font-semibold text-slate-500" aria-hidden="true">:</span>
          <select
            aria-label="Due minute"
            value={minute}
            disabled={disabled}
            onChange={event => change(date, hour, event.target.value)}
            className={controlClass}
          >
            {Array.from({ length: 60 }, (_, index) => <option key={index} value={pad(index)}>{pad(index)}</option>)}
          </select>
        </div>
      </div>
    </section>
  );
}
