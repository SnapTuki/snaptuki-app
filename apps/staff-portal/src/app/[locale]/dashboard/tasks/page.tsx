"use client";

import React, { useState } from 'react';
import { TaskAssignmentForm } from '@/features/tasks/components/TaskAssignmentForm';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Circle,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react';

// Mock Data representing the current shift's workload
const mockTasks = [
  { id: '1', title: 'Administer Insulin', patient: 'Eleanor Rigby', room: '101', caregiver: 'Sarah Miller', priority: 'high', status: 'pending', due: '10:00 AM' },
  { id: '2', title: 'Wound Dressing Change', patient: 'Arthur Dent', room: '104', caregiver: 'John Doe', priority: 'medium', status: 'in-progress', due: '11:30 AM' },
  { id: '3', title: 'Lunch Assistance', patient: 'Martha Jones', room: '202', caregiver: 'Emily Chen', priority: 'low', status: 'pending', due: '12:00 PM' },
  { id: '4', title: 'Physical Therapy Prep', patient: 'John Smith', room: '105', caregiver: 'Unassigned', priority: 'medium', status: 'completed', due: '09:00 AM' },
];

function PriorityBadge({ level }: { level: string }) {
  const styles: any = {
    high: 'bg-red-50 text-red-600 border-red-100',
    medium: 'bg-amber-50 text-amber-600 border-amber-100',
    low: 'bg-blue-50 text-blue-600 border-blue-100'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${styles[level] || styles.low}`}>
      {level}
    </span>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
  if (status === 'in-progress') return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
  return <Circle className="w-5 h-5 text-slate-300" />;
}

export default function TaskManagementPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-8">
      <TaskAssignmentForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Task Control</h1>
          <p className="text-slate-500 font-medium">Monitor execution and assign care duties</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Assign New Task
        </button>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 flex gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          {['all', 'pending', 'in-progress', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`
                px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap
                ${filter === tab ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
              `}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full h-full pl-10 pr-4 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/10 outline-none"
          />
        </div>
      </div>

      {/* Task List Container */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-50">
              <tr>
                <th className="pl-8 py-5 w-16 text-center text-[11px] font-bold text-slate-400 uppercase">Status</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Task Details</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Assigned To</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Priority</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Due Time</th>
                <th className="pr-8 py-5 text-right text-[11px] font-bold text-slate-400 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockTasks.map((task) => (
                <tr key={task.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                  <td className="pl-8 py-4 text-center">
                    <StatusIcon status={task.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-slate-900 text-base">{task.title}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Patient: <span className="text-slate-700">{task.patient}</span> • Room {task.room}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {task.caregiver === 'Unassigned' ? (
                      <span className="text-xs font-bold text-slate-400 italic bg-slate-100 px-2 py-1 rounded-md">
                        Unassigned
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          {task.caregiver.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{task.caregiver}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge level={task.priority} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-bold font-mono">{task.due}</span>
                    </div>
                  </td>
                  <td className="pr-8 py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination / Footer */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex justify-center">
          <button className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
            Load More Tasks
          </button>
        </div>
      </div>
    </div>
  );
}