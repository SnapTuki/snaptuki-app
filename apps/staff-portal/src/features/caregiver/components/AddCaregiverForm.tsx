"use client";

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, User, Mail, Phone, Briefcase, Shield, Loader2, CheckCircle2 } from 'lucide-react';

interface AddCaregiverFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const CaregiverSchema = Yup.object().shape({
  fullName: Yup.string().min(2, 'Name too short').required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().min(10, 'Invalid phone number').required('Phone is required'),
  role: Yup.string().required('Role is required'),
  contractType: Yup.string().required('Contract type is required'),
});

export function AddCaregiverForm({ isOpen, onClose }: AddCaregiverFormProps) {
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