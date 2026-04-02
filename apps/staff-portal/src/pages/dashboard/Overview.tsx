import React from 'react';
import { 
  Users, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  HeartPulse,
  PhoneCall,
  Calendar,
  Pill,
  UserPlus,
  ArrowRight,
  ShieldAlert,
  ListTodo
} from 'lucide-react';

// --- MOCK DATA FOR COORDINATOR ---
const PULSE_METRICS = [
  { id: 1, label: 'Critical Pending', value: '3', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100' },
  { id: 2, label: 'Active Staff', value: '12', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 3, label: 'Overdue Tasks', value: '5', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 4, label: 'Completion Rate', value: '84%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
];

const ACTION_REQUIRED = [
  { id: 'A1', type: 'medication', resident: 'Matti Korhonen', room: 'Room 112', issue: 'Missed scheduled Metformin (12:00)', time: '45 mins overdue', severity: 'critical' },
  { id: 'A2', type: 'unassigned', resident: 'Eleanor Rigby', room: 'Room 101', issue: 'Vitals check requires assignment', time: 'Due in 30 mins', severity: 'warning' },
  { id: 'A3', type: 'escalation', resident: 'Arthur Dent', room: 'Room 104-A', issue: 'Caregiver note: "Refusing lunch, seems agitated"', time: '10 mins ago', severity: 'critical' },
];

const WORKLOAD_BALANCER = [
  { id: 'S1', name: 'Sarah Miller', role: 'Head Nurse', totalTasks: 12, completed: 8, avatar: 'SM', isOverloaded: false },
  { id: 'S2', name: 'Johan Lindholm', role: 'Caregiver', totalTasks: 15, completed: 4, avatar: 'JL', isOverloaded: true },
  { id: 'S3', name: 'Anna Korhonen', role: 'Caregiver', totalTasks: 6, completed: 5, avatar: 'AK', isOverloaded: false },
  { id: 'S4', name: 'David Wright', role: 'Physiotherapist', totalTasks: 8, completed: 4, avatar: 'DW', isOverloaded: false },
];

const ACTIVITY_FEED = [
  { id: 'F1', time: '10:24 AM', message: 'Anna Korhonen completed Morning Hygiene for Clara Oswald.', type: 'completion' },
  { id: 'F2', time: '10:15 AM', message: 'System auto-generated 14 lunch preparation tasks.', type: 'system' },
  { id: 'F3', time: '09:50 AM', message: 'Sarah Miller marked Routine Checkup IN PROGRESS for Arthur Dent.', type: 'progress' },
  { id: 'F4', time: '09:45 AM', message: 'Johan Lindholm logged shift start.', type: 'system' },
  { id: 'F5', time: '09:30 AM', message: 'Anna Korhonen completed Medication Admin for Eleanor Rigby.', type: 'completion' },
];

export function Overview() {
  // Basic greeting logic
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const currentDate = new Intl.DateTimeFormat('en-FI', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  return (
    // ROOT: Fixed height, Flex Column. Matches Task Center & Resident Directory exactly.
    <div className="flex flex-col h-[calc(100vh-6rem)] min-h-[600px] overflow-hidden bg-slate-50/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hide Scrollbar CSS Injection */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* =========================================
          FIXED HEADER AREA (Will never scroll)
          ========================================= */}
      <div className="shrink-0 flex flex-col gap-5 pb-4 pt-2 z-10 bg-slate-50/50">
        
        {/* Title & Primary Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {greeting}, Coordinator
            </h1>
            <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {currentDate} — Helsinki Operations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm flex items-center gap-2">
              <PhoneCall className="w-4 h-4" /> Directory
            </button>
            <button className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Broadcast Alert
            </button>
          </div>
        </div>

        {/* The "Pulse" - Thin Boxed KPI Stats */}
        <div className="flex flex-wrap items-center gap-4 text-sm mt-1">
          {PULSE_METRICS.map((metric) => (
            <div key={metric.id} className="flex-1 min-w-[200px] flex items-center gap-3 p-3 border border-slate-200 bg-white/60 rounded-xl shadow-sm">
              <div className={`w-10 h-10 rounded-full ${metric.bg} flex items-center justify-center shrink-0`}>
                 <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{metric.label}</p>
                <p className="text-xl font-black text-slate-900 leading-none">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
          SCROLLABLE DASHBOARD AREA (Hidden Scrollbar)
          ========================================= */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-10 pr-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT/CENTER COLUMNS: Action Required & Workload */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* ACTION REQUIRED INBOX (The Red Zone) */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-500" /> Action Required
                </h2>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-800">View All</button>
              </div>

              <div className="flex flex-col gap-3">
                {ACTION_REQUIRED.map((alert) => (
                  <div key={alert.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 shadow-sm rounded-2xl hover:shadow-md hover:border-rose-200 transition-all relative overflow-hidden">
                    {/* Severity Border Accent */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${alert.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                    
                    <div className="flex items-center gap-4 pl-2 flex-1 min-w-0">
                      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        alert.type === 'medication' ? 'bg-rose-100 text-rose-600' :
                        alert.type === 'unassigned' ? 'bg-amber-100 text-amber-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {alert.type === 'medication' && <Pill className="w-5 h-5" />}
                        {alert.type === 'unassigned' && <UserPlus className="w-5 h-5" />}
                        {alert.type === 'escalation' && <AlertCircle className="w-5 h-5" />}
                      </div>
                      
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h4 className="font-bold text-slate-900 text-base">{alert.resident}</h4>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {alert.room}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-600 truncate">{alert.issue}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 shrink-0">
                      <span className={`text-xs font-bold flex items-center gap-1 ${alert.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'}`}>
                        <Clock className="w-3.5 h-3.5" /> {alert.time}
                      </span>
                      <button className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
                        {alert.type === 'unassigned' ? 'Assign Staff' : 'Resolve Issue'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WORKLOAD BALANCER */}
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" /> Live Workload
                </h2>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-800">Manage Roster</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {WORKLOAD_BALANCER.map((staff) => {
                  const progress = Math.round((staff.completed / staff.totalTasks) * 100);
                  return (
                    <div key={staff.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col gap-4 hover:border-blue-200 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                            {staff.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-tight">{staff.name}</p>
                            <p className="text-xs font-medium text-slate-500">{staff.role}</p>
                          </div>
                        </div>
                        {staff.isOverloaded && (
                          <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-rose-100">
                            High Load
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-500 flex items-center gap-1"><ListTodo className="w-3.5 h-3.5" /> Task Progress</span>
                          <span className="text-slate-700">{staff.completed} / {staff.totalTasks}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${staff.isOverloaded ? 'bg-rose-500' : 'bg-blue-500'}`} 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Activity Feed */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" /> Activity Log
              </h2>
            </div>
            
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 h-full min-h-[400px]">
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                {ACTIVITY_FEED.map((feed) => (
                  <div key={feed.id} className="relative pl-6">
                    {/* Timeline Node */}
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white ${
                      feed.type === 'completion' ? 'bg-emerald-500' :
                      feed.type === 'progress' ? 'bg-blue-500' :
                      'bg-slate-300'
                    }`} />
                    
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-1">{feed.time}</p>
                      <p className="text-sm font-medium text-slate-700 leading-relaxed">{feed.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm">
                Load More Activity
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}