"use client";

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  X, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  User, 
  Heart, 
  CheckSquare, 
  Repeat,
  Loader2,
  Save
} from 'lucide-react';

interface TaskAssignmentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaskSchema = Yup.object().shape({
  title: Yup.string().required('Task title is required'),
  patientId: Yup.string().required('Select a patient'),
  caregiverId: Yup.string().required('Assign a caregiver'),
  priority: Yup.string().required('Priority level is required'),
  dueTime: Yup.string().required('Due time is required'),
});

export function TaskAssignmentForm({ isOpen, onClose }: TaskAssignmentFormProps) {
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      patientId: '',
      caregiverId: '',
      priority: 'medium',
      dueTime: '',
      isRecurring: false,
    },
    validationSchema: TaskSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Assigning Task:', values);
      setSubmitting(false);
      resetForm();
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-300 border-l border-slate-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Assign Task</h2>
            <p className="text-sm text-slate-500">Create a new care instruction</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Task Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Task Title</label>
            <input
              {...formik.getFieldProps('title')}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium"
              placeholder="e.g. Administer Insulin"
            />
            {formik.touched.title && formik.errors.title && <div className="text-red-500 text-xs ml-1">{formik.errors.title}</div>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Patient Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Patient</label>
              <div className="relative">
                <Heart className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <select
                  {...formik.getFieldProps('patientId')}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                >
                  <option value="">Select Resident</option>
                  <option value="1">Eleanor Rigby (101)</option>
                  <option value="2">Arthur Dent (104)</option>
                </select>
              </div>
               {formik.touched.patientId && formik.errors.patientId && <div className="text-red-500 text-xs ml-1">{formik.errors.patientId}</div>}
            </div>

            {/* Caregiver Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Assign To</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <select
                  {...formik.getFieldProps('caregiverId')}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                >
                  <option value="">Select Staff</option>
                  <option value="1">Sarah Miller</option>
                  <option value="2">John Doe</option>
                </select>
              </div>
              {formik.touched.caregiverId && formik.errors.caregiverId && <div className="text-red-500 text-xs ml-1">{formik.errors.caregiverId}</div>}
            </div>
          </div>

          {/* Priority Toggles */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Urgency Level</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'low', label: 'Routine', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                { id: 'medium', label: 'Important', color: 'bg-amber-50 border-amber-200 text-amber-700' },
                { id: 'high', label: 'Critical', color: 'bg-red-50 border-red-200 text-red-700' },
              ].map((p) => (
                <label
                  key={p.id}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all
                    ${formik.values.priority === p.id 
                      ? p.color + ' ring-1 ring-offset-1 ring-slate-300' 
                      : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}
                  `}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p.id}
                    onChange={formik.handleChange}
                    className="hidden"
                  />
                  <AlertTriangle className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold">{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Time & Recurring */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Due By</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="time"
                  {...formik.getFieldProps('dueTime')}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center h-full pt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`
                  w-12 h-7 rounded-full p-1 transition-colors duration-300
                  ${formik.values.isRecurring ? 'bg-blue-600' : 'bg-slate-200'}
                `}>
                  <div className={`
                    w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300
                    ${formik.values.isRecurring ? 'translate-x-5' : 'translate-x-0'}
                  `} />
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  {...formik.getFieldProps('isRecurring')} 
                  checked={formik.values.isRecurring} 
                />
                <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 flex items-center gap-1">
                  <Repeat className="w-3 h-3" /> Daily Repeat
                </span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Instructions / Notes</label>
            <textarea
              {...formik.getFieldProps('description')}
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
              placeholder="Detailed instructions for the caregiver..."
            />
          </div>

        </form>

        {/* Footer */}
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
            Assign Task
          </button>
        </div>
      </div>
    </>
  );
}