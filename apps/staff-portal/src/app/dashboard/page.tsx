"use client";

import React from 'react';
import { 
  Users, 
  Activity, 
  Clock, 
  AlertCircle,
  ChevronRight,
  TrendingUp
} from "lucide-react";

/**
 * StatCard Feature Component
 */
function StatCard({ label, value, icon: Icon, color, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
            <TrendingUp className="w-3 h-3" /> {trend}
          </span>
        )}
      </div>
      <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">{label}</p>
      <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}

export default function DashboardOverview() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Facility Overview</h1>
        <p className="text-slate-500 font-medium">Monitoring Snaptuki Care Home Activity</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Active Caregivers" 
          value="12" 
          icon={Users} 
          color="bg-blue-50 text-blue-600"
          trend="+2 now"
        />
        <StatCard 
          label="Total Patients" 
          value="48" 
          icon={Activity} 
          color="bg-indigo-50 text-indigo-600"
        />
        <StatCard 
          label="Pending Tasks" 
          value="24" 
          icon={Clock} 
          color="bg-amber-50 text-amber-600"
        />
        <StatCard 
          label="Critical Alerts" 
          value="3" 
          icon={AlertCircle} 
          color="bg-red-50 text-red-600"
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Live Task Execution</h2>
            <button className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-5 flex items-center justify-between border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                    P{i}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Medication - Room 10{i}</p>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Assigned to Sarah M.</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    In Progress
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-bold">Updated 2m ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Caregiver Status Sidebar */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">On Duty</h2>
          <div className="space-y-4">
            {[
              { name: "Sarah Miller", role: "Head Caregiver", status: "Online" },
              { name: "John Doe", role: "Nursing Asst.", status: "In Room 22" },
              { name: "Emily Chen", role: "Care Specialist", status: "Break" }
            ].map((staff, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{staff.name}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{staff.role}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${staff.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{staff.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}