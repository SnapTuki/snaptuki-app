import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Monitor, 
  Languages,
  User,
  Lock,
  Mail,
  Smartphone,
} from 'lucide-react';
import { useAuthStore } from '../../lib/store/authStore';
import { useQuery } from '@apollo/client/react';
import { gql, type TypedDocumentNode } from '@apollo/client';
import type { Query } from '../../lib/graphql/generated';

/**
 * --- GRAPHQL TYPES & OPERATION ---
 */


interface CaregiverProfileVariables {
  id: string;
}

// 1. Define the TypedDocumentNode for strict end-to-end type safety
export const GET_CAREGIVER_PROFILE: TypedDocumentNode<
  Query, 
  CaregiverProfileVariables
> = gql`
  query GetCaregiverProfile($id: String!) {
    caregiverById(id: $id) {
      id
      firstName
      lastName
      email
      phone
      role
    }
  }
`;

/**
 * --- HELPER COMPONENTS ---
 */

function Section({ icon: Icon, title, description, children }: { icon: any, title: string, description?: string, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mb-6">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-blue-600 shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 text-base">{title}</h3>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

// Professional Skeleton Loader for Data Fetching
function ProfileSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-8 animate-pulse">
      <div className="shrink-0 flex flex-col items-center gap-3">
        <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-sm" />
        <div className="h-6 w-24 bg-slate-200 rounded-md" />
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-10 w-full bg-slate-100 rounded-lg border border-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * --- MAIN PAGE COMPONENT ---
 */
export default function SettingsPage() {
  const { user } = useAuthStore();
  const [language, setLanguage] = useState('en');
  
  // Local state for editable form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    type: ''
  });

  // 2. Execute the GQL Query
  const { data, loading, error } = useQuery(GET_CAREGIVER_PROFILE, {
    variables: { id: user?.userId || '' },
    skip: !user?.userId, // Prevent fetching if user isn't loaded yet
    fetchPolicy: 'cache-and-network',
  });

  // 3. Sync fetched data into local editable state
  useEffect(() => {
    if (data?.caregiverById) {
      setFormData({
        firstName: data.caregiverById.firstName,
        lastName: data.caregiverById.lastName,
        email: data.caregiverById.email || '',
        phone: data.caregiverById.phone || '',
        type: data.caregiverById.role || 'Staff'
      });
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase();
    }
    return 'SM'; // Fallback
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Portal Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account, preferences, and security configurations.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm">
            Discard
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 text-sm flex items-center gap-2">
            Save Changes
          </button>
        </div>
      </div>

      {/* 1. Account Profile */}
      <Section icon={User} title="My Profile" description="Update your personal information and contact details.">
        {error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            Failed to load profile data. Please try refreshing the page.
          </div>
        ) : loading ? (
          <ProfileSkeleton />
        ) : (
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="shrink-0 flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center text-2xl font-bold text-slate-600">
                {getInitials()}
              </div>
              <button className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-md transition-colors shadow-sm">
                Change Photo
              </button>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName} 
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-900 transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName} 
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-900 transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email} 
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-900 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone} 
                    onChange={handleInputChange}
                    placeholder="+358 40 123 4567"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-900 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Role / Title</label>
                <input 
                  type="text" 
                  value={formData.type.replace('_', ' ')} 
                  disabled 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm text-slate-500 cursor-not-allowed" 
                />
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* 2. General & Localization */}
      <Section icon={Languages} title="Localization & Region" description="Configure language and time settings for your dashboard.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Portal Language</label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none text-sm text-slate-900 transition-all"
              >
                <option value="en">English (US)</option>
                <option value="fi">Suomi (Finnish)</option>
                <option value="sv">Svenska (Swedish)</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. Security */}
      <Section icon={ShieldCheck} title="Security & Compliance" description="Manage access to your account and health data privacy.">
        <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex items-center justify-center gap-2 py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Lock className="w-4 h-4 text-slate-500" /> Change Password
            </button>
            <button className="flex items-center justify-center gap-2 py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Monitor className="w-4 h-4 text-slate-500" /> View Active Sessions
            </button>
        </div>
      </Section>

      <div className="text-center pb-8 pt-4">
        <p className="text-xs text-slate-400 font-medium">SnapTuki Staff Portal v2.4.0 • Helsinki Region</p>
      </div>

    </div>
  );
}