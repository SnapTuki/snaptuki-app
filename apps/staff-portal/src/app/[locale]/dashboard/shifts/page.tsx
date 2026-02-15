"use client";

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  User, 
  AlertTriangle,
  MoreVertical,
  Briefcase,
  X,
  Save,
  Trash2,
  Loader2,
  CheckCircle2
} from 'lucide-react';

/**
 * --- TYPES ---
 */
type ShiftType = 'morning' | 'afternoon' | 'night';

interface Shift {
  id: string;
  caregiverId: string;
  caregiverName: string;
  role: 'nurse' | 'caregiver' | 'assistant';
  date: string; // YYYY-MM-DD
  type: ShiftType;
  floor: string;
}

interface Caregiver {
  id: string;
  name: string;
  role: 'nurse' | 'caregiver' | 'assistant';
  defaultFloor: string;
}

/**
 * --- MOCK DATA ---
 */
const MOCK_CAREGIVERS: Caregiver[] = [
  { id: '1', name: 'Sarah Miller', role: 'nurse', defaultFloor: '1st Floor' },
  { id: '2', name: 'John Doe', role: 'assistant', defaultFloor: '2nd Floor' },
  { id: '3', name: 'Emily Chen', role: 'caregiver', defaultFloor: '1st Floor' },
  { id: '4', name: 'Marcus Wright', role: 'caregiver', defaultFloor: '3rd Floor' },
  { id: '5', name: 'Jessica Pearson', role: 'nurse', defaultFloor: '2nd Floor' },
];

const INITIAL_SHIFTS: Shift[] = [
  { id: '101', caregiverId: '1', caregiverName: 'Sarah Miller', role: 'nurse', date: new Date().toISOString().split('T')[0], type: 'morning', floor: '1st Floor' },
  { id: '102', caregiverId: '3', caregiverName: 'Emily Chen', role: 'caregiver', date: new Date().toISOString().split('T')[0], type: 'afternoon', floor: '2nd Floor' },
];

const SHIFT_TYPES: Record<ShiftType, { label: string; time: string; color: string; border: string }> = {
  morning: { label: 'Morning', time: '07:00 - 15:00', color: 'bg-amber-50 text-amber-700', border: 'border-amber-200' },
  afternoon: { label: 'Afternoon', time: '15:00 - 23:00', color: 'bg-blue-50 text-blue-700', border: 'border-blue-200' },
  night: { label: 'Night', time: '23:00 - 07:00', color: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-200' },
};

/**
 * --- HELPER: DATE LOGIC ---
 */
const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

const getWeekDays = (startDate: Date) => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    days.push({
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      isToday: d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
    });
  }
  return days;
};

/**
 * --- INTERNAL COMPONENT: SHIFT FORM DRAWER ---
 */
const ShiftSchema = Yup.object().shape({
  caregiverId: Yup.string().required('Select a staff member'),
  floor: Yup.string().required('Floor assignment is required'),
});

interface ShiftFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Shift | null;
  slotData?: { date: string; type: ShiftType } | null;
}

function ShiftFormDrawer({ isOpen, onClose, onSubmit, initialValues, slotData }: ShiftFormProps) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      caregiverId: initialValues?.caregiverId || '',
      floor: initialValues?.floor || '',
      // If editing, use existing values. If new, use slot data.
      date: initialValues?.date || slotData?.date || '',
      type: initialValues?.type || slotData?.type || 'morning',
    },
    validationSchema: ShiftSchema,
    onSubmit: async (values, { setSubmitting }) => {
      // Find selected caregiver details to enrich the data
      const caregiver = MOCK_CAREGIVERS.find(c => c.id === values.caregiverId);
      
      const payload = {
        ...values,
        caregiverName: caregiver?.name || 'Unknown',
        role: caregiver?.role || 'caregiver',
        id: initialValues?.id || Math.random().toString(36).substr(2, 9),
      };

      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
      onSubmit(payload);
      setSubmitting(false);
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 border-l border-slate-100 flex flex-col">
        
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {initialValues ? 'Edit Shift' : 'Assign Shift'}
            </h2>
            <p className="text-sm text-slate-500">
              {new Date(formik.values.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Read-Only Context */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-4">
            <div className="p-2 bg-white rounded-lg text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Shift Time</p>
              <p className="text-sm font-bold text-blue-900 capitalize">
                {formik.values.type} ({SHIFT_TYPES[formik.values.type as ShiftType]?.time})
              </p>
            </div>
          </div>

          {/* Caregiver Selection */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700">Select Staff Member</label>
            <div className="space-y-2">
              {MOCK_CAREGIVERS.map((staff) => (
                <label 
                  key={staff.id}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                    ${formik.values.caregiverId === staff.id 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'}
                  `}
                >
                  <input 
                    type="radio" 
                    name="caregiverId"
                    value={staff.id}
                    onChange={formik.handleChange}
                    className="hidden"
                  />
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs
                    ${formik.values.caregiverId === staff.id ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'}
                  `}>
                    {staff.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{staff.name}</p>
                    <p className={`text-xs ${formik.values.caregiverId === staff.id ? 'text-slate-400' : 'text-slate-400'}`}>
                      {staff.role} • usually {staff.defaultFloor}
                    </p>
                  </div>
                  {formik.values.caregiverId === staff.id && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </label>
              ))}
            </div>
            {formik.touched.caregiverId && formik.errors.caregiverId && (
              <div className="text-red-500 text-xs font-bold">{formik.errors.caregiverId}</div>
            )}
          </div>

          {/* Floor Assignment */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Floor / Zone</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <select
                {...formik.getFieldProps('floor')}
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none font-medium"
              >
                <option value="">Select Zone</option>
                <option value="1st Floor">1st Floor (General)</option>
                <option value="2nd Floor">2nd Floor (Memory Care)</option>
                <option value="3rd Floor">3rd Floor (Rehab)</option>
              </select>
            </div>
            {formik.touched.floor && formik.errors.floor && (
              <div className="text-red-500 text-xs font-bold mt-1">{formik.errors.floor}</div>
            )}
          </div>

        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50">
            Cancel
          </button>
          <button 
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting}
            className="flex-[2] py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            {formik.isSubmitting ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />}
            {initialValues ? 'Update Shift' : 'Assign Staff'}
          </button>
        </div>
      </div>
    </>
  );
}


/**
 * --- MAIN PAGE COMPONENT ---
 */
export default function ShiftManagementPage() {
  const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));
  const [shifts, setShifts] = useState<Shift[]>(INITIAL_SHIFTS);
  const [selectedShiftType, setSelectedShiftType] = useState<ShiftType | 'all'>('all');
  
  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [newSlotData, setNewSlotData] = useState<{ date: string; type: ShiftType } | null>(null);

  const currentWeek = getWeekDays(weekStart);

  // Actions
  const handlePrevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const handleNextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const handleAddShift = (date: string, type: ShiftType) => {
    setEditingShift(null);
    setNewSlotData({ date, type });
    setIsDrawerOpen(true);
  };

  const handleEditShift = (shift: Shift, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingShift(shift);
    setNewSlotData(null);
    setIsDrawerOpen(true);
  };

  const handleRemoveShift = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this shift assignment?')) {
      setShifts(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleFormSubmit = (shiftData: Shift) => {
    if (editingShift) {
      // Update existing
      setShifts(prev => prev.map(s => s.id === shiftData.id ? shiftData : s));
    } else {
      // Create new
      setShifts(prev => [...prev, shiftData]);
    }
  };

  const getShiftsForDayAndType = (dateStr: string, type: ShiftType) => {
    return shifts.filter(s => s.date === dateStr && s.type === type);
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <ShiftFormDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={editingShift}
        slotData={newSlotData}
      />

      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Shift Roster</h1>
          <p className="text-slate-500 font-medium">Manage weekly staffing coverage (24/7)</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Shift Filter */}
          <div className="bg-white p-1 rounded-xl border border-slate-200 flex">
            {(['all', 'morning', 'afternoon', 'night'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedShiftType(type)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all
                  ${selectedShiftType === type 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                `}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Week Navigation */}
          <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1">
            <button onClick={handlePrevWeek} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-4 flex items-center gap-2 font-bold text-slate-700 min-w-[140px] justify-center">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <span>{currentWeek[0].dayNum} - {currentWeek[6].dayNum} {new Date(currentWeek[6].dateStr).toLocaleDateString('en-US', { month: 'short' })}</span>
            </div>
            <button onClick={handleNextWeek} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all">
            <Plus className="w-5 h-5" />
            Auto-Fill
          </button>
        </div>
      </div>

      {/* Roster Grid */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-[600px] min-w-[1200px]">
        {/* Days Header */}
        <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50/50">
          <div className="p-4 border-r border-slate-200 flex items-center justify-center font-bold text-slate-400 text-xs uppercase tracking-widest">
            Time Slot
          </div>
          {currentWeek.map((day, idx) => (
            <div key={idx} className={`p-4 text-center border-r border-slate-100 last:border-0 ${day.isWeekend ? 'bg-indigo-50/30' : ''} ${day.isToday ? 'bg-blue-50/50' : ''}`}>
              <p className={`text-xs font-bold uppercase ${day.isToday ? 'text-blue-600' : 'text-slate-400'}`}>{day.dayName}</p>
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center mx-auto mt-1 font-extrabold text-sm
                ${day.isToday ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-900'}
              `}>
                {day.dayNum}
              </div>
            </div>
          ))}
        </div>

        {/* Shift Rows */}
        <div className="flex-1 overflow-y-auto">
          {(['morning', 'afternoon', 'night'] as const).map((type) => {
            if (selectedShiftType !== 'all' && selectedShiftType !== type) return null;

            return (
              <div key={type} className="grid grid-cols-8 border-b border-slate-100 min-h-[180px]">
                {/* Time Label Column */}
                <div className="p-4 border-r border-slate-200 bg-white flex flex-col justify-center items-center gap-2">
                  <div className={`p-2 rounded-xl ${SHIFT_TYPES[type].color} bg-opacity-20`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-700 text-sm">{SHIFT_TYPES[type].label}</p>
                    <p className="text-xs text-slate-400 font-medium">{SHIFT_TYPES[type].time}</p>
                  </div>
                </div>

                {/* Day Columns */}
                {currentWeek.map((day, dIdx) => {
                  const dayShifts = getShiftsForDayAndType(day.dateStr, type);
                  const isWeekend = day.isWeekend;

                  return (
                    <div 
                      key={dIdx} 
                      className={`
                        p-2 border-r border-slate-100 last:border-0 relative group transition-colors flex flex-col gap-2
                        ${isWeekend ? 'bg-indigo-50/10' : 'bg-white'}
                        ${day.isToday ? 'bg-blue-50/10' : ''}
                        hover:bg-slate-50
                      `}
                    >
                      {/* Add Button (Visible on Hover) */}
                      <button 
                        onClick={() => handleAddShift(day.dateStr, type)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-blue-100 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-blue-200 hover:shadow-sm"
                        title="Add Staff"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      {/* Shift Cards */}
                      {dayShifts.map((shift) => (
                        <div 
                          key={shift.id}
                          onClick={(e) => handleEditShift(shift, e)}
                          className={`
                            p-3 rounded-xl border text-left relative group/card cursor-pointer shadow-sm hover:shadow-md transition-all bg-white border-slate-200 hover:border-blue-300
                          `}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                              shift.role === 'nurse' ? 'bg-indigo-100 text-indigo-700' : 
                              shift.role === 'assistant' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {shift.role}
                            </span>
                          </div>
                          
                          <p className="text-xs font-bold truncate text-slate-900">
                            {shift.caregiverName}
                          </p>
                          
                          <div className="flex items-center gap-1 mt-1">
                            <Briefcase className="w-2.5 h-2.5 text-slate-400" />
                            <span className="text-[9px] text-slate-500 font-medium truncate">{shift.floor}</span>
                          </div>

                          {/* Delete Action (Top right of card on hover) */}
                          <button 
                            onClick={(e) => handleRemoveShift(shift.id, e)}
                            className="absolute top-1 right-1 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover/card:opacity-100 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      
                      {dayShifts.length === 0 && (
                        <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                            onClick={() => handleAddShift(day.dateStr, type)}
                            className="text-xs font-bold text-slate-300 hover:text-blue-500 flex flex-col items-center gap-1"
                           >
                              <Plus className="w-4 h-4" />
                              <span>Assign</span>
                           </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}