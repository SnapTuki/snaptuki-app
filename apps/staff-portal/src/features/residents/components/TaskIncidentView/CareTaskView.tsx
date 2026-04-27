import React, { useState } from 'react';
import { 
  Plus, Calendar, Filter, CheckCircle2, XCircle, 
  Clock, ChevronRight, ClipboardList, User, 
  AlertCircle, Edit3, Trash2, Check, X,
  ArrowUpCircle
} from 'lucide-react';

// --- TYPES ---
interface CareTask {
  id: string;
  title: string;
  description: string;
  dueDate: 'Today' | 'Tomorrow';
  deadline: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  priority: 'ROUTINE' | 'HIGH' | 'CRITICAL';
  assignedTo: string;
}

const CareTaskView = () => {
  const [selectedDate, setSelectedDate] = useState<'Today' | 'Tomorrow'>('Today');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedTask, setSelectedTask] = useState<CareTask | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mock Data
  const [tasks, setTasks] = useState<CareTask[]>([
    { id: '1', title: 'Morning Hygiene Assist', description: 'Partial bed bath and oral care.', dueDate: 'Today', deadline: '09:00 AM', status: 'COMPLETED', priority: 'ROUTINE', assignedTo: 'Nurse Sarah' },
    { id: '2', title: 'Wound Dressing Change', description: 'Lower left leg ulcer. Clean with saline and apply hydrocolloid.', dueDate: 'Today', deadline: '11:30 AM', status: 'PENDING', priority: 'CRITICAL', assignedTo: 'Nurse Sarah' },
    { id: '3', title: 'Physical Therapy Assist', description: 'Ambulate 50ft with walker. Monitor SpO2.', dueDate: 'Tomorrow', deadline: '10:00 AM', status: 'PENDING', priority: 'HIGH', assignedTo: 'CNA Mike' },
  ]);

  const filteredTasks = tasks.filter(t => t.dueDate === selectedDate && (filterStatus === 'ALL' || t.status === filterStatus));

  const handleStatusUpdate = (id: string, newStatus: 'COMPLETED' | 'CANCELLED') => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    setSelectedTask(null);
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500">
      
      {/* 1. FIXED ACTION HEADER */}
      <header className="shrink-0 px-8 py-6 border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between gap-10 max-w-[1600px] mx-auto">
          
          <div className="flex items-center gap-10">
            {/* Date Toggle */}
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Schedule</span>
              <div className="flex p-1.5 bg-slate-100 rounded-xl border border-slate-200/50">
                {['Today', 'Tomorrow'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d as any)}
                    className={`px-6 py-2 text-[11px] font-black rounded-lg transition-all ${
                      selectedDate === d ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-4 border-l border-slate-200 pl-10">
               <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</span>
               <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-sm font-black text-slate-800 outline-none border-b-2 border-transparent hover:border-slate-300 focus:border-blue-600 cursor-pointer py-1 transition-all"
               >
                 <option value="ALL">All Tasks</option>
                 <option value="PENDING">Pending</option>
                 <option value="COMPLETED">Completed</option>
                 <option value="CANCELLED">Cancelled</option>
               </select>
            </div>
          </div>

          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-3 px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] hover:bg-blue-600 active:scale-95 transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" /> <span>Add New Task</span>
          </button>
        </div>
      </header>

      {/* 2. TASK LEDGER (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className="max-w-[1600px] mx-auto">
          {/* Column Names */}
          <div className="flex items-center px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
            <div className="w-24">Deadline</div>
            <div className="w-32">Priority</div>
            <div className="flex-1 px-4">Intervention Description</div>
            <div className="w-48">Personnel</div>
            <div className="w-32 text-right">Status</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-50">
            {filteredTasks.map(task => (
              <div 
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`group flex items-center px-6 py-6 transition-all cursor-pointer border-l-4 ${
                  task.status === 'COMPLETED' ? 'bg-slate-50/50 border-emerald-500 opacity-60' :
                  task.priority === 'CRITICAL' ? 'bg-rose-50/40 border-rose-600 hover:bg-rose-50' :
                  'bg-white border-transparent hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="w-24 shrink-0 flex items-center gap-2">
                  <Clock className={`w-3.5 h-3.5 ${task.status === 'PENDING' ? 'text-blue-500' : 'text-slate-300'}`} />
                  <span className="text-sm font-bold text-slate-600">{task.deadline}</span>
                </div>

                <div className="w-32 shrink-0">
                  <span className={`text-[9px] font-black px-2 py-1 rounded-md tracking-wider ${
                    task.priority === 'CRITICAL' ? 'bg-rose-600 text-white' : 
                    task.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>

                <div className="flex-1 px-4 min-w-0">
                  <p className="text-base font-bold tracking-tight text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{task.description}</p>
                </div>

                <div className="w-48 shrink-0 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">
                    {task.assignedTo.split(' ')[1][0]}
                  </div>
                  <span className="text-xs font-bold text-slate-600">{task.assignedTo}</span>
                </div>

                <div className="w-32 shrink-0 flex justify-end">
                   {task.status === 'COMPLETED' ? (
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                   ) : task.status === 'CANCELLED' ? (
                     <XCircle className="w-5 h-5 text-slate-300" />
                   ) : (
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-white border border-slate-200 rounded-lg text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                          <Check className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                          <X className="w-4 h-4" />
                        </button>
                     </div>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. TASK DETAIL MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Task Detail & Protocol</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Update Care Task</h2>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-2 bg-slate-100 text-slate-400 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Field: Title */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Intervention</label>
                <input 
                  defaultValue={selectedTask.title}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-lg font-bold text-slate-800 outline-none ring-2 ring-transparent focus:ring-blue-500/10 transition-all"
                />
              </div>

              {/* Field: Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinical Instructions</label>
                <textarea 
                  rows={3}
                  defaultValue={selectedTask.description}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-base font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deadline</label>
                  <input type="time" defaultValue="09:00" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                  <select defaultValue={selectedTask.priority} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 outline-none">
                    <option>ROUTINE</option>
                    <option>HIGH</option>
                    <option>CRITICAL</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-8 py-8 bg-slate-50 flex gap-3">
              <button 
                onClick={() => handleStatusUpdate(selectedTask.id, 'COMPLETED')}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" /> Force Complete
              </button>
              <button 
                onClick={() => handleStatusUpdate(selectedTask.id, 'CANCELLED')}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
              >
                <XCircle className="w-4 h-4" /> Cancel Task
              </button>
              <button 
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
              >
                Update Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CareTaskView;