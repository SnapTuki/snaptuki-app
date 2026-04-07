import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react'
import { 
  Search, Filter, Plus, Clock, 
  AlertCircle, User, X, 
  Users, UserPlus, Zap, MoreHorizontal,
  ChevronRight 
} from "lucide-react";
import { CREATE_ADHOC_TASK } from '../../features/taskCenter/graphql/mutations';
import { GET_TASK_LIST } from '../../features/taskCenter/graphql/queries';

export default function TaskCenter() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Data
  const { data, loading, error, refetch } = useQuery(GET_TASK_LIST, {
    variables: { search: searchTerm },
  });

  // 2. Organize Data into Columns (Memoized)
  const columns = useMemo(() => {
    const tasks = data?.taskList || [];
    return {
      unassigned: tasks.filter(t => !t.assignedCaregiverId && t.status !== 'COMPLETED'),
      active: tasks.filter(t => t.assignedCaregiverId && t.status === 'IN_PROGRESS'),
      alerts: tasks.filter(t => t.priority === 'HIGH' && t.status !== 'COMPLETED')
    };
  }, [data]);

  if (error) return <div className="p-10 text-rose-500">Error loading tasks: {error.message}</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-50/50 overflow-hidden text-slate-900 font-sans">
      
      {/* HEADER */}
      <div className="shrink-0 flex flex-col gap-5 pb-4 pt-6 z-10 bg-slate-50/50 px-6 md:px-10 border-b border-slate-200/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Task Command Center</h1>
            <p className="text-slate-500 font-medium mt-1">Coordinate care routines and manage the global task pool.</p>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" /> New Ad-hoc Task
          </button>
        </div>

        {/* STATS */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <StatBox icon={<Users className="w-3.5 h-3.5 text-amber-600" />} label="The Pool" count={columns.unassigned.length} color="bg-amber-100" />
          <StatBox icon={<Zap className="w-3.5 h-3.5 text-blue-600" />} label="Active Now" count={columns.active.length} color="bg-blue-100" />
          <StatBox icon={<AlertCircle className="w-3.5 h-3.5 text-rose-600" />} label="Alerts" count={columns.alerts.length} color="bg-rose-100" />
        </div>

        {/* SEARCH */}
        <div className="flex justify-end mt-1">
          <div className="relative group w-full lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search resident or task..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* MAIN BOARD */}
      <main className="flex-1 flex gap-1 overflow-x-auto">
        <TaskColumn title="Unassigned" subtitle="Pool" count={columns.unassigned.length}>
          {columns.unassigned.map(task => <TaskCard key={task.id} task={task} />)}
        </TaskColumn>

        <TaskColumn title="In Progress" subtitle="Active" count={columns.active.length}>
          {columns.active.map(task => <TaskCard key={task.id} task={task} />)}
        </TaskColumn>

        <TaskColumn title="Attention" subtitle="Alerts" count={columns.alerts.length} isAlert>
          {columns.alerts.map(task => <TaskCard key={task.id} task={task} />)}
        </TaskColumn>
      </main>

      <AdHocDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSuccess={() => { setIsDrawerOpen(false); refetch(); }}
      />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatBox({ icon, label, count, color }: {icon: any, label: string, count: number, color: string}) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 border border-slate-200 bg-white/60 rounded-xl shadow-sm">
      <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center`}>{icon}</div>
      <span className="text-slate-500 font-medium">{label}: <strong className="text-slate-900 ml-0.5">{count}</strong></span>
    </div>
  );
}

function TaskColumn({ title, subtitle, count, children, isAlert }: {title: string, subtitle: string, count: number, children: any, isAlert?: boolean}) {
  return (
    <div className="flex-1 min-w-[340px] flex flex-col h-full border-r border-slate-100 last:border-r-0">
      <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center">
        <div>
          <h3 className={`text-[11px] font-black uppercase tracking-[0.15em] ${isAlert ? 'text-rose-500' : 'text-slate-900'}`}>{title}</h3>
          <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
        </div>
        <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100">{count}</span>
      </div>
      <div className="flex-1 p-5 overflow-y-auto space-y-4 pb-10">{children}</div>
    </div>
  );
}

function TaskCard({ task }: {task: any}) {
  return (
    <div className="group bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${task.priority === 'HIGH' ? 'bg-rose-500' : 'bg-blue-400'}`} />
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{task.category}</span>
          </div>
          <h4 className="text-sm font-bold text-slate-800 leading-tight">{task.title}</h4>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-5 p-3 bg-slate-50/50 rounded-xl border border-slate-50">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 shadow-sm">
          <User className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-0.5">Resident</p>
          <p className="text-xs font-bold text-slate-700">{task.resident.firstName + " "}{" "+task.resident.lastName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {task.assignedCaregiverId ? (
          <div className="flex-1 flex items-center justify-between bg-slate-900 px-4 py-2 rounded-xl">
            <span className="text-[10px] font-bold text-white/80">Assigned</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        ) : (
          <button className="flex-1 bg-white border border-slate-200 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 hover:border-slate-900 transition-all flex items-center justify-center gap-2">
            <UserPlus className="w-3.5 h-3.5" /> Assign
          </button>
        )}
      </div>
    </div>
  );
}

function AdHocDrawer({ isOpen, onClose, onSuccess }: {isOpen: boolean, onClose: () => void, onSuccess: () => void}) {
  const [form, setForm] = useState({ title: '', priority: 'MED', residentId: '', category: 'Care' });
  const [createTask, { loading }] = useMutation(CREATE_ADHOC_TASK);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      await createTask({ 
        variables: { 
          input: { 
            ...form, 
            id: crypto.randomUUID(), // Or let backend handle ID generation
            assignedCaregiverId: null // Ad-hoc often starts unassigned
          } 
        } 
      });
      onSuccess();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-100">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
             <h2 className="text-xl font-black text-slate-900">New Ad-hoc Task</h2>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Direct Dispatch</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-300" /></button>
        </div>

        <div className="flex-1 p-8 space-y-8 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Task Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none font-bold text-sm" 
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {['LOW', 'MED', 'HIGH'].map(p => (
                <button 
                  key={p} 
                  onClick={() => setForm({...form, priority: p})}
                  className={`py-3 rounded-xl border font-black text-[10px] tracking-widest transition-all ${
                    form.priority === p ? 'border-slate-900 text-slate-900 bg-slate-50' : 'border-slate-100 text-slate-300'
                  }`}
                >{p}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 bg-white border-t border-slate-100 flex gap-3">
          <button disabled={loading} onClick={handleSubmit} className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black flex items-center justify-center gap-3">
            {loading ? 'Processing...' : 'Confirm Dispatch'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}