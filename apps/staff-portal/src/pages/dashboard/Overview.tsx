import { 
  Users, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  ArrowDownRight,
  HeartPulse,
  PhoneCall,
  Calendar
} from 'lucide-react';
import { useAuthStore } from '../../lib/store/authStore';
// --- MOCK DATA ---
const KPI_STATS = [
  { 
    id: 1, 
    label: 'Active Residents', 
    value: '142', 
    trend: '+2 this month', 
    trendUp: true, 
    icon: Users, 
    color: 'bg-blue-500' 
  },
  { 
    id: 2, 
    label: 'Staff on Duty', 
    value: '24', 
    trend: 'Optimal coverage', 
    trendUp: true, 
    icon: Activity, 
    color: 'bg-emerald-500' 
  },
  { 
    id: 3, 
    label: 'Pending Tasks', 
    value: '18', 
    trend: '-5 since morning', 
    trendUp: true, 
    icon: CheckCircle2, 
    color: 'bg-indigo-500' 
  },
  { 
    id: 4, 
    label: 'Critical Alerts', 
    value: '3', 
    trend: 'Requires immediate action', 
    trendUp: false, 
    icon: AlertCircle, 
    color: 'bg-rose-500' 
  },
];

const PRIORITY_ALERTS = [
  {
    id: 'A1',
    patient: 'Elsa Virtanen',
    room: 'Room 204',
    issue: 'Abnormal Heart Rate Detected',
    time: '10 mins ago',
    severity: 'critical', // critical, warning, info
  },
  {
    id: 'A2',
    patient: 'Matti Korhonen',
    room: 'Room 112',
    issue: 'Missed scheduled medication (12:00)',
    time: '45 mins ago',
    severity: 'warning',
  },
  {
    id: 'A3',
    patient: 'Aino Nieminen',
    room: 'Room 305',
    issue: 'Fall sensor activated - False alarm cleared',
    time: '2 hours ago',
    severity: 'info',
  },
];

const STAFF_ON_DUTY = [
  { id: 'S1', name: 'Sarah Miller', role: 'Head Nurse', status: 'AVAILABLE', avatar: 'SM' },
  { id: 'S2', name: 'Johan Lindholm', role: 'Caregiver', status: 'ON_JOB', avatar: 'JL' },
  { id: 'S3', name: 'Anna Korhonen', role: 'Caregiver', status: 'BUSY', avatar: 'AK' },
  { id: 'S4', name: 'David Wright', role: 'Physiotherapist', status: 'AVAILABLE', avatar: 'DW' },
];

export function Overview() {
  const user = useAuthStore((state) => state.user);
  
  // Basic greeting logic
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const currentDate = new Intl.DateTimeFormat('en-FI', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {greeting}, {user?.firstName || 'Staff'}
          </h1>
          <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {currentDate} — Helsinki Operations
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm flex items-center gap-2">
            <PhoneCall className="w-4 h-4" /> Directory
          </button>
          <button className="px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 text-sm flex items-center gap-2">
            <HeartPulse className="w-4 h-4" /> Log Incident
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPI_STATS.map((stat) => (
          <div key={stat.id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group">
            {/* Background accent glow */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 ${stat.color} opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} bg-opacity-10`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${stat.trendUp ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </span>
            </div>
            
            <div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-1">{stat.value}</h3>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Priority Alerts (Takes up 2/3 width on large screens) */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Priority Alerts</h2>
              <p className="text-sm text-slate-500 font-medium">Requires immediate attention</p>
            </div>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
          </div>

          <div className="space-y-4">
            {PRIORITY_ALERTS.map((alert) => (
              <div key={alert.id} className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all bg-slate-50/50">
                <div className={`shrink-0 p-3 rounded-2xl ${
                  alert.severity === 'critical' ? 'bg-rose-100 text-rose-600' :
                  alert.severity === 'warning' ? 'bg-amber-100 text-amber-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <AlertCircle className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900">{alert.patient}</h4>
                    <span className="text-xs font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {alert.room}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">{alert.issue}</p>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2 shrink-0">
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> {alert.time}
                  </span>
                  <button className="text-sm font-bold text-blue-600 bg-white px-4 py-1.5 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff on Duty (Takes up 1/3 width) */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 sm:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-extrabold text-slate-900">Staff on Duty</h2>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {STAFF_ON_DUTY.length} Active
            </span>
          </div>

          <div className="space-y-5 flex-1">
            {STAFF_ON_DUTY.map((staff) => (
              <div key={staff.id} className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center">
                    <span className="font-bold text-slate-600">{staff.avatar}</span>
                  </div>
                  {/* Status Indicator */}
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    staff.status === 'AVAILABLE' ? 'bg-emerald-500' :
                    staff.status === 'ON_JOB' ? 'bg-blue-500' : 'bg-amber-500'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{staff.name}</p>
                  <p className="text-xs font-medium text-slate-500 truncate">{staff.role}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm">
            View Full Roster
          </button>
        </div>

      </div>
    </div>
  );
}