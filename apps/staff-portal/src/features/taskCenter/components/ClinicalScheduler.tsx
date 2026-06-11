import { useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronRight } from 'lucide-react';

export function ClinicalScheduler({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  // Use useMemo to ensure 'now' doesn't change on every micro-render
  const now = useMemo(() => new Date(), []);
  
  // If no value exists, we use now, otherwise we parse the saved ISO string
  const selectedDate = useMemo(() => (value ? new Date(value) : new Date(now.getTime() + 15 * 60000)), [value]);

  const isToday = selectedDate.toLocaleDateString() === now.toLocaleDateString();
  const isTomorrow = selectedDate.toLocaleDateString() === new Date(now.getTime() + 86400000).toLocaleDateString();

  const handleDateToggle = (type: 'today' | 'tomorrow') => {
    let newDate = new Date(selectedDate); // Start with currently selected time
    const targetDate = new Date();
    if (type === 'tomorrow') targetDate.setDate(targetDate.getDate() + 1);

    newDate.setFullYear(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    // If switching to today and time is now in the past, bump to future
    if (newDate < now) {
      newDate = new Date(now.getTime() + 15 * 60000);
    }

    onChange(newDate.toISOString());
  };

  const timeOptions = useMemo(() => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (const m of [0, 15, 30, 45]) {
        const d = new Date(selectedDate);
        d.setHours(h, m, 0, 0);
        if (d >= now) {
          options.push({ 
            h, m, 
            label: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
            val: `${h}-${m}`
          });
        }
      }
    }
    return options;
  }, [selectedDate.toLocaleDateString(), now]);

  return (
    <div className="flex items-center gap-3  p-1.5 rounded-2xl border border-slate-50 w-fit">
      <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-100">
        <button
          type="button"
          onClick={() => handleDateToggle('today')}
          className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${isToday ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => handleDateToggle('tomorrow')}
          className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${isTomorrow ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
        >
          Tomorrow
        </button>
      </div>

      <div className="flex items-center gap-2 pr-2">
        <Clock className="w-3.5 h-3.5 text-indigo-500" />
        <select
          value={`${selectedDate.getHours()}-${selectedDate.getMinutes()}`}
          onChange={(e) => {
            const [h, m] = e.target.value.split('-').map(Number);
            const d = new Date(selectedDate);
            d.setHours(h, m, 0, 0);
            onChange(d.toISOString());
          }}
          className="bg-transparent border-none text-xs font-black text-slate-700 outline-none p-0"
        >
          {timeOptions.map((opt) => (
            <option key={opt.val} value={opt.val}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}