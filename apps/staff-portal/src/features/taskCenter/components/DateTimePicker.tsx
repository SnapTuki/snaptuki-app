import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sun, Sunrise, Sunset, Moon, CalendarDays, ChevronRight } from 'lucide-react';

interface DateTimePickerProps {
  value?: string | Date; // ISO string or Date object
  onChange: (isoString: string) => void;
  disabled?: boolean;
}

export function DateTimePicker({ value, onChange, disabled = false }: DateTimePickerProps) {
  // Initialize state based on incoming value or default to now
  const initialDate = value ? new Date(value) : new Date();
  
  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate.toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    initialDate.toTimeString().slice(0, 5) // "HH:MM"
  );

  // Sync internal state changes up to the parent form
  useEffect(() => {
    if (!selectedDate || !selectedTime) return;
    
    const newDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    if (!isNaN(newDateTime.getTime())) {
      onChange(newDateTime.toISOString());
    }
  }, [selectedDate, selectedTime]);

  // ==========================================
  // QUICK SELECT HANDLERS
  // ==========================================
  
  const handleQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleQuickTime = (timeString: string) => {
    setSelectedTime(timeString);
  };

  // ==========================================
  // UI HELPERS
  // ==========================================
  
  const isToday = (dateString: string) => {
    return dateString === new Date().toISOString().split('T')[0];
  };

  const isTomorrow = (dateString: string) => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return dateString === d.toISOString().split('T')[0];
  };

  const quickDates = [
    { label: 'Today', action: () => handleQuickDate(0), isActive: isToday(selectedDate) },
    { label: 'Tomorrow', action: () => handleQuickDate(1), isActive: isTomorrow(selectedDate) },
    { label: 'In 2 Days', action: () => handleQuickDate(2), isActive: false },
    { label: 'Next Week', action: () => handleQuickDate(7), isActive: false },
  ];

  const quickTimes = [
    { label: 'Morning', time: '09:00', icon: Sunrise },
    { label: 'Noon', time: '12:00', icon: Sun },
    { label: 'Afternoon', time: '15:00', icon: Sunset },
    { label: 'Evening', time: '18:00', icon: Moon },
  ];

  return (
    <div className={`w-full bg-white border border-slate-200 rounded-3xl p-6 shadow-sm ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Task Schedule</h3>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
            Set Date & Time for Execution
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ========================================== */}
        {/* DATE SECTION */}
        {/* ========================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              Select Date
            </label>
          </div>

          {/* Quick Date Selectors */}
          <div className="grid grid-cols-2 gap-2">
            {quickDates.map((qd) => (
              <button
                key={qd.label}
                type="button"
                onClick={qd.action}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  qd.isActive 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                {qd.label}
              </button>
            ))}
          </div>

          {/* Custom Date Picker */}
          <div className="relative mt-4">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <CalendarDays className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* ========================================== */}
        {/* TIME SECTION */}
        {/* ========================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Select Time
            </label>
          </div>

          {/* Quick Time Selectors */}
          <div className="grid grid-cols-2 gap-2">
            {quickTimes.map((qt) => {
              const isActive = selectedTime === qt.time;
              const Icon = qt.icon;
              return (
                <button
                  key={qt.label}
                  type="button"
                  onClick={() => handleQuickTime(qt.time)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                    isActive 
                      ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {qt.label}
                </button>
              );
            })}
          </div>

          {/* Custom Time Picker */}
          <div className="relative mt-4">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all cursor-pointer"
            />
          </div>
        </div>

      </div>

      {/* SUMMARY FOOTER */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between bg-slate-50 -mx-6 -mb-6 px-6 py-4 rounded-b-3xl">
        <span className="text-xs font-semibold text-slate-500">Selected Schedule</span>
        <div className="flex items-center gap-2 text-sm font-black text-indigo-600">
          {new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
          <ChevronRight className="w-4 h-4 text-slate-300 mx-1" />
          {new Date(`${selectedDate}T${selectedTime}`).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
          })}
        </div>
      </div>

    </div>
  );
}