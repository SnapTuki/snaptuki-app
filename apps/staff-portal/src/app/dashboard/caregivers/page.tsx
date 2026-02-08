"use client";

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Star, 
  CheckCircle2, 
  Clock, 
  MapPin,
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Shield,
  Loader2
} from "lucide-react";

/**
 * --- INTERNAL COMPONENT: ADD CAREGIVER FORM ---
 * Consolidated here to ensure stability and immediate availability.
 */

const CaregiverSchema = Yup.object().shape({
  fullName: Yup.string().min(2, 'Name too short').required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().min(10, 'Invalid phone number').required('Phone is required'),
  role: Yup.string().required('Role is required'),
  contractType: Yup.string().required('Contract type is required'),
});

interface AddCaregiverFormProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddCaregiverForm({ isOpen, onClose }: AddCaregiverFormProps) {
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
      role: 'caregiver',
      contractType: 'full-time',
    },
    validationSchema: CaregiverSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // Simulate GraphQL Mutation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Creating Caregiver:', values);
      setSubmitting(false);
      resetForm();
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" 
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out border-l border-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">New Caregiver</h2>
            <p className="text-sm text-slate-500">Add staff to Snaptuki registry</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                {...formik.getFieldProps('fullName')}
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.fullName && formik.errors.fullName 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
                placeholder="e.g. Sarah Miller"
              />
            </div>
            {formik.touched.fullName && formik.errors.fullName && (
              <div className="text-red-500 text-xs ml-1 font-medium">{formik.errors.fullName}</div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                {...formik.getFieldProps('email')}
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.email && formik.errors.email 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
                placeholder="staff@snaptuki.care"
              />
            </div>
             {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-xs ml-1 font-medium">{formik.errors.email}</div>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                {...formik.getFieldProps('phone')}
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.phone && formik.errors.phone 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
                placeholder="+1 (555) 000-0000"
              />
            </div>
             {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-500 text-xs ml-1 font-medium">{formik.errors.phone}</div>
            )}
          </div>

          <div className="h-px bg-slate-100 my-4" />

          {/* Role Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Role Assignment</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'head_caregiver', label: 'Head Nurse', icon: Shield },
                { id: 'caregiver', label: 'Caregiver', icon: User },
                { id: 'assistant', label: 'Assistant', icon: Briefcase },
                { id: 'trainee', label: 'Trainee', icon: CheckCircle2 },
              ].map((role) => (
                <label 
                  key={role.id}
                  className={`
                    relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${formik.values.role === role.id 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'}
                  `}
                >
                  <input 
                    type="radio" 
                    name="role"
                    value={role.id}
                    onChange={formik.handleChange}
                    className="absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  <role.icon className={`w-6 h-6 ${formik.values.role === role.id ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold">{role.label}</span>
                </label>
              ))}
            </div>
          </div>

           {/* Contract Type */}
           <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Contract Type</label>
            <select
               {...formik.getFieldProps('contractType')}
               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-100 transition-all appearance-none"
            >
              <option value="full-time">Full-Time (40h/week)</option>
              <option value="part-time">Part-Time (20h/week)</option>
              <option value="contractor">Contractor / Locum</option>
            </select>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting}
            className="flex-[2] py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {formik.isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Create Profile'
            )}
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * --- MAIN PAGE COMPONENT ---
 */

const mockCaregivers = [
  { id: '1', name: 'Sarah Miller', role: 'Head Caregiver', status: 'Online', performance: 98, tasks: 14, email: 's.miller@snaptuki.care', phone: '+1 234 567 890' },
  { id: '2', name: 'John Doe', role: 'Nursing Assistant', status: 'In Room 204', performance: 85, tasks: 8, email: 'j.doe@snaptuki.care', phone: '+1 234 567 891' },
  { id: '3', name: 'Emily Chen', role: 'Care Specialist', status: 'On Break', performance: 92, tasks: 11, email: 'e.chen@snaptuki.care', phone: '+1 234 567 892' },
  { id: '4', name: 'Marcus Wright', role: 'Junior Caregiver', status: 'Offline', performance: 78, tasks: 5, email: 'm.wright@snaptuki.care', phone: '+1 234 567 893' },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'Online': 'bg-emerald-100 text-emerald-700',
    'In Room 204': 'bg-blue-100 text-blue-700',
    'On Break': 'bg-amber-100 text-amber-700',
    'Offline': 'bg-slate-100 text-slate-500',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors[status] || colors['Offline']}`}>
      {status}
    </span>
  );
}

function PerformanceBar({ score }: { score: number }) {
  const color = score > 90 ? 'bg-emerald-500' : score > 80 ? 'bg-blue-500' : 'bg-amber-500';
  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between text-[10px] font-bold text-slate-500">
        <span>EFFICIENCY</span>
        <span>{score}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function CaregiverManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* ADD CAREGIVER SLIDE-OVER */}
      <AddCaregiverForm 
        isOpen={isAddDrawerOpen} 
        onClose={() => setIsAddDrawerOpen(false)} 
      />

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Caregivers</h1>
          <p className="text-slate-500 font-medium">Manage your team and monitor performance</p>
        </div>
        <button 
          onClick={() => setIsAddDrawerOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Add New Caregiver
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, role or ID..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Caregiver Grid/Table */}
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Caregiver</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Performance</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tasks Done</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockCaregivers.map((staff) => (
                  <tr key={staff.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-lg border border-white shadow-sm">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{staff.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{staff.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={staff.status} />
                    </td>
                    <td className="px-8 py-6 w-64">
                      <PerformanceBar score={staff.performance} />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold text-slate-700">{staff.tasks}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">This Week</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-400 hover:text-slate-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
          <div className="relative z-10">
            <Star className="w-8 h-8 mb-4 text-indigo-200" />
            <h3 className="text-xl font-bold mb-1">Top Performer</h3>
            <p className="text-indigo-100 text-sm mb-4">Sarah Miller reached 98% efficiency this week.</p>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold transition-all">
              Send Recognition
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <Clock className="w-8 h-8 text-amber-500" />
            <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-lg">ATTENTION</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mt-4">Training Due</h3>
            <p className="text-slate-500 text-sm">2 caregivers have mandatory safety training expiring soon.</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <MapPin className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mt-4">Capacity Status</h3>
            <p className="text-slate-500 text-sm">Staffing levels are optimal for the current 48 patients.</p>
          </div>
        </div>
      </div>
    </div>
  );
}