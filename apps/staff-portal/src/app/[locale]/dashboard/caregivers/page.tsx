"use client";

import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_CAREGIVER_CARDS } from '@/features/caregiver/graphql/queries';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Star, 
  CheckCircle2, 
  Clock, 
  MapPin,
  Loader2,
  AlertCircle,
  ShieldCheck
} from "lucide-react";
import { AddCaregiverForm } from '@/features/caregiver/components/AddCaregiverForm';
// --- HELPER COMPONENTS ---

function StatusBadge({ status }: { status: string }) {
  // Normalize status string to match UI colors
  const normalized = status?.toUpperCase() || 'OFFLINE';
  
  const styles: Record<string, string> = {
    'ONLINE': 'bg-emerald-100 text-emerald-700',
    'AVAILABLE': 'bg-emerald-100 text-emerald-700',
    'ON_JOB': 'bg-blue-100 text-blue-700',
    'BUSY': 'bg-amber-100 text-amber-700',
    'OFFLINE': 'bg-slate-100 text-slate-500',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[normalized] || styles['OFFLINE']}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

function PerformanceBar({ rating }: { rating: number }) {
  // Convert 5-star rating to percentage
  const percentage = (rating / 5) * 100;
  const color = percentage >= 90 ? 'bg-emerald-500' : percentage >= 70 ? 'bg-blue-500' : 'bg-amber-500';
  
  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between text-[10px] font-bold text-slate-500">
        <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-slate-400 text-slate-400" /> RATING</span>
        <span>{rating.toFixed(1)} / 5.0</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export default function CaregiverManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  // 1. Fetch Real Data using the new query
  const { data, loading, error } = useQuery(GET_CAREGIVER_CARDS, {
    variables: {
      city: searchTerm || undefined, // Simple search mapping
      verified: undefined, // Could hook up to a filter toggle
      offeredServiceIds: []
    },
    fetchPolicy: 'cache-and-network'
  });

  // 2. Loading State
  if (loading && !data) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
        <p className="font-medium">Loading staff directory...</p>
      </div>
    );
  }

  // 3. Error State
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-800">
        <AlertCircle className="w-6 h-6" />
        <div>
          <p className="font-bold">Unable to load caregivers</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  const caregivers = data?.listCaregivers || [];

  return (
    <div className="space-y-8">
      {/* Drawer */}
      {/* Note: Ensure AddCaregiverForm is imported or defined in this file context if not using the separate file */}
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
            placeholder="Search by city..." 
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
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Rating</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Jobs Done</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {caregivers.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="px-8 py-12 text-center text-slate-500">
                       No caregivers found matching your criteria.
                     </td>
                   </tr>
                ) : (
                  caregivers.map((staff) => (
                    <tr key={staff.id} className="group hover:bg-slate-50/80 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          {staff.profilePhotoUrl ? (
                            <img 
                              src={staff.profilePhotoUrl} 
                              alt={staff.firstName} 
                              className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-lg border border-white shadow-sm">
                              {staff.firstName?.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {staff.firstName} {staff.lastName}
                              </p>
                              {staff.verified && (
                                <ShieldCheck className="w-4 h-4 text-blue-500" aria-label="Verified" />
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {staff.city || 'No Location'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={staff.availabilityStatus} />
                      </td>
                      <td className="px-8 py-6 w-64">
                        <PerformanceBar rating={staff.rating || 0} />
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="font-bold text-slate-700">{staff.completedJobsCount}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Jobs</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-400 hover:text-slate-600">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Overview Cards (Static for now, but could be computed from 'data') */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
          <div className="relative z-10">
            <Star className="w-8 h-8 mb-4 text-indigo-200" />
            <h3 className="text-xl font-bold mb-1">Top Rated</h3>
            <p className="text-indigo-100 text-sm mb-4">
              {caregivers[0] ? `${caregivers[0].firstName} has the highest rating.` : 'No data available'}
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </div>
        {/* ... Other static cards ... */}
      </div>
    </div>
  );
}