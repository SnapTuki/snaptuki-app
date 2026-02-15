"use client";

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Bed, 
  HeartPulse, 
  Activity, 
  Calendar, 
  MapPin, 
  X,
  User,
  FileText,
  AlertCircle,
  Edit2,
  Trash2,
  Loader2,
  Save
} from "lucide-react";

/**
 * --- TYPES ---
 */
interface Patient {
  id: string;
  fullName: string;
  roomNumber: string;
  age: number;
  careLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'hospitalized';
  condition: string;
}

/**
 * --- INTERNAL COMPONENT: PATIENT FORM (ADD/EDIT) ---
 */
const PatientSchema = Yup.object().shape({
  fullName: Yup.string().min(2).required('Name is required'),
  roomNumber: Yup.string().required('Room is required'),
  age: Yup.number().positive().integer().required('Age is required'),
  careLevel: Yup.string().required('Care level is required'),
  condition: Yup.string().required('Primary condition is required'),
});

interface PatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: Patient | null; // If provided, we are in EDIT mode
}

function PatientForm({ isOpen, onClose, initialValues }: PatientFormProps) {
  const isEditMode = !!initialValues;

  const formik = useFormik({
    initialValues: initialValues || {
      id: '',
      fullName: '',
      roomNumber: '',
      age: '',
      careLevel: 'medium',
      status: 'active',
      condition: '',
    },
    enableReinitialize: true,
    validationSchema: PatientSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API
      console.log(isEditMode ? 'Updating Patient:' : 'Creating Patient:', values);
      setSubmitting(false);
      resetForm();
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 border-l border-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEditMode ? 'Edit Patient' : 'Admit Patient'}
            </h2>
            <p className="text-sm text-slate-500">
              {isEditMode ? 'Update medical records' : 'Register new resident'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Personal Details</h3>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  {...formik.getFieldProps('fullName')}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. Eleanor Rigby"
                />
              </div>
              {formik.touched.fullName && formik.errors.fullName && <div className="text-red-500 text-xs mt-1">{formik.errors.fullName as string}</div>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    {...formik.getFieldProps('age')}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="82"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Room No.</label>
                <div className="relative">
                  <Bed className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    {...formik.getFieldProps('roomNumber')}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="104-B"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Medical Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Care Profile</h3>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Care Intensity Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map((level) => (
                  <label 
                    key={level}
                    className={`
                      flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all
                      ${formik.values.careLevel === level 
                        ? level === 'high' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}
                    `}
                  >
                    <input 
                      type="radio" 
                      name="careLevel" 
                      value={level} 
                      onChange={formik.handleChange} 
                      className="hidden" 
                    />
                    <Activity className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold uppercase">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Primary Condition / Notes</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <textarea
                  {...formik.getFieldProps('condition')}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                  placeholder="e.g. Dementia, requires assistance with mobility..."
                />
              </div>
            </div>
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
            className="flex-[2] py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {formik.isSubmitting ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditMode ? 'Update Record' : 'Admit Patient'}
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * --- MAIN PAGE COMPONENT ---
 */

const mockPatients: Patient[] = [
  { id: '1', fullName: 'Eleanor Rigby', age: 82, roomNumber: '101', careLevel: 'low', status: 'active', condition: 'Hypertension' },
  { id: '2', fullName: 'Arthur Dent', age: 74, roomNumber: '104-A', careLevel: 'high', status: 'active', condition: 'Post-Stroke Recovery' },
  { id: '3', fullName: 'Martha Jones', age: 89, roomNumber: '202', careLevel: 'medium', status: 'hospitalized', condition: 'Dementia' },
  { id: '4', fullName: 'John Smith', age: 79, roomNumber: '105', careLevel: 'low', status: 'active', condition: 'Diabetes' },
  { id: '5', fullName: 'Clara Oswald', age: 85, roomNumber: '301', careLevel: 'high', status: 'active', condition: 'Mobility impaired' },
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);

  // Handlers
  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setIsDrawerOpen(true);
  };

  const handleCreate = () => {
    setEditingPatient(null);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to discharge this patient? This action cannot be undone.')) {
      setPatients(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* FORM DRAWER */}
      <PatientForm 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        initialValues={editingPatient}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Patient Directory</h1>
          <p className="text-slate-500 font-medium">Manage residents, admissions, and medical records</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Admit Patient
        </button>
      </div>

      {/* FILTER & STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search Bar */}
        <div className="lg:col-span-3 bg-white p-2 rounded-2xl border border-slate-100 flex shadow-sm">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, room number or condition..." 
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none outline-none text-slate-700 font-medium placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 border-l border-slate-100 text-slate-500 hover:text-blue-600 font-bold text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Mini Stat */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Occupancy</p>
            <p className="text-2xl font-extrabold text-indigo-900">{patients.length} <span className="text-sm font-medium text-indigo-400">/ 60</span></p>
          </div>
          <Bed className="w-8 h-8 text-indigo-300" />
        </div>
      </div>

      {/* PATIENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            
            {/* Status Strip */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
              patient.status === 'hospitalized' ? 'bg-amber-400' :
              patient.careLevel === 'high' ? 'bg-red-400' : 'bg-emerald-400'
            }`} />

            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  {patient.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">{patient.fullName}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="font-medium">Room {patient.roomNumber}</span>
                  </div>
                </div>
              </div>
              <div className="dropdown relative">
                <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
                {/* In a real app, a dropdown menu would go here. For now we use the buttons below */}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                <HeartPulse className={`w-5 h-5 ${patient.careLevel === 'high' ? 'text-red-500' : 'text-blue-500'}`} />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condition</p>
                  <p className="text-sm font-bold text-slate-700">{patient.condition}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                 <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5
                  ${patient.careLevel === 'high' ? 'bg-red-50 text-red-600' : 
                    patient.careLevel === 'medium' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}
                 `}>
                  <Activity className="w-3.5 h-3.5" />
                  {patient.careLevel} Care
                 </span>
                 <span className="text-xs font-bold text-slate-400">{patient.age} Yrs</span>
              </div>
            </div>

            {/* Quick Actions (Hover Reveal) */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-white/90 backdrop-blur-sm border-t border-slate-100 translate-y-full group-hover:translate-y-0 transition-transform flex gap-3">
              <button 
                onClick={() => handleEdit(patient)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button 
                onClick={() => handleDelete(patient.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Discharge
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}