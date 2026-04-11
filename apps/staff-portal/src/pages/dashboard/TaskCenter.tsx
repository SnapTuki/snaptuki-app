import { useState, useMemo, useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  Plus, Search, Activity, Loader2, Trash2, ClipboardCheck,
  Clock, MoreVertical, Users, X, UserPlus,
  ChevronDown, AlertCircle, ChevronRight, Check, User as UserIcon,
  Calendar, BarChart3, History as HistoryIcon, Filter
} from "lucide-react";

import { GET_TASK_LIST, SEARCH_CAREGIVERS, SEARCH_RESIDENTS } from '../../features/taskCenter/graphql/queries';
import { CREATE_ADHOC_TASK } from '../../features/taskCenter/graphql/mutations';

export default function TaskCenter() {
  const [activeTab, setActiveTab] = useState('Today'); // Today, Performance, History
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);

  // Filtering states for Today Tab
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // History states
  const [historyDate, setHistoryDate] = useState(new Date().toISOString().split('T')[0]);

  const { data, refetch } = useQuery(GET_TASK_LIST, {
    variables: { search: searchTerm },
  });

  const allTasks = data?.taskList || [];

  // Filtered tasks for Today View
  const filteredTasks = useMemo(() => {
    return allTasks.filter((t: any) => {
      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    });
  }, [allTasks, statusFilter, priorityFilter]);

  const completionRate = Math.round((allTasks.filter((t: any) => t.status === "COMPLETED").length / allTasks.length) * 100) || 0;

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans overflow-hidden">

      {/* HEADER SECTION */}
      <div className="shrink-0 flex flex-col gap-5 pb-4 pt-4 z-[60] bg-white border-b border-slate-200 px-6 md:px-10">
        <div className="max-w-[1920px] mx-auto px-10 pt-6 pb-2">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-4">
            <div className="flex items-center gap-5">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Clinical Flow</h1>
                <p className="text-[10px] font-bold uppercase text-slate-400 mt-1 tracking-widest">Elder Care Command Center</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search stream..."
                  className="pl-11 pr-4 py-2 bg-slate-100 border-transparent rounded-xl w-64 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setIsDispatchOpen(true)}
                className="bg-slate-900 hover:bg-black text-white px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" /> Quick Dispatch
              </button>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex items-center gap-8 mt-2">
            <TabItem label="Today" active={activeTab === 'Today'} onClick={() => setActiveTab('Today')} icon={<Clock className="w-4 h-4" />} />
            <TabItem label="Performance" active={activeTab === 'Performance'} onClick={() => setActiveTab('Performance')} icon={<BarChart3 className="w-4 h-4" />} />
            <TabItem label="History" active={activeTab === 'History'} onClick={() => setActiveTab('History')} icon={<HistoryIcon className="w-4 h-4" />} />
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <main className="flex-1 flex overflow-hidden">

        {/* TODAY TAB VIEW */}
        {activeTab === 'Today' && (
          <div className="flex flex-1 overflow-hidden">
            {/* LEFT SIDE: FILTERABLE LIST */}
            <section className="w-[450px] shrink-0 border-r border-slate-200 bg-white flex flex-col">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Filter className="w-3 h-3" /> Live Filters
                  </h2>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{filteredTasks.length} Tasks</span>
                </div>
                <div className="flex gap-2">
                  <select
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider outline-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  <select
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider outline-none"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="ALL">All Priority</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-white">
                {filteredTasks.map((task: any) => (
                  <StreamItem
                    key={task.id}
                    task={task}
                    active={selectedTask?.id === task.id}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
              </div>
            </section>

            {/* RIGHT SIDE: SELECTED TASK PREVIEW/EDITOR */}
            <section className="flex-1 bg-slate-50 overflow-y-auto">
              {selectedTask ? (
                <div className="max-w-4xl mx-auto py-12 px-10">
                  <div className="">
                    <TaskDetailView task={selectedTask} key={selectedTask.id}/>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <ClipboardCheck className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest">Select a task to view details</p>
                </div>
              )}
            </section>
          </div>
        )}

        {/* HISTORY TAB VIEW */}
        {activeTab === 'History' && (
          <div className="flex-1 flex flex-col p-10 max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between mb-10 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Archives</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Audit previous care records</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <Calendar className="w-5 h-5 text-slate-400 ml-2" />
                <input
                  type="date"
                  value={historyDate}
                  onChange={(e) => setHistoryDate(e.target.value)}
                  className="bg-transparent border-none outline-none font-bold text-sm text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Logic for history tasks based on date would go here */}
              <p className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-[40px]">
                Showing records for {new Date(historyDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {/* PERFORMANCE TAB VIEW */}
        {activeTab === 'Performance' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Analytics Dashboard</h2>
              <p className="text-sm text-slate-400 font-bold mt-2">Metrics will be available once the shift ends.</p>
            </div>
          </div>
        )}

      </main>

      <DispatchDrawer isOpen={isDispatchOpen} onClose={() => setIsDispatchOpen(false)} />
    </div>
  );
}

// =========================================
// HELPER COMPONENTS
// =========================================

function TabItem({ label, active, onClick, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-2 py-4 transition-all relative group`}
    >
      <div className={`${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {icon}
      </div>
      <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {label}
      </span>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full animate-in fade-in slide-in-from-bottom-1" />
      )}
    </button>
  );
}

function StreamItem({ task, active, onClick }: any) {
  const isHigh = task.priority === "HIGH";
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden ${active
          ? "bg-slate-900 border-slate-900 shadow-xl shadow-slate-200 translate-x-2"
          : isHigh
            ? "bg-rose-50 border-rose-100 hover:border-rose-300"
            : "bg-white border-slate-100 hover:border-slate-300"
        }`}
    >
      <div className={`flex justify-between mb-3 text-[9px] font-black uppercase tracking-widest ${active ? 'text-slate-400' : 'text-slate-500'}`}>
        <span>{task.status}</span>
        <span>10:30 AM</span>
      </div>
      <h4 className={`text-sm font-black mb-2 leading-snug ${active ? 'text-white' : 'text-slate-800'}`}>
        {task.title}
      </h4>
      <div className={`flex items-center gap-2 text-[10px] font-bold ${active ? 'text-indigo-400' : 'text-slate-500'}`}>
        <Users className="w-3 h-3" />
        {task.resident?.firstName} {task.resident?.lastName}
      </div>
      {active && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <ChevronRight className="w-5 h-5 text-indigo-500" />
        </div>
      )}
    </div>
  );
}

function TaskDetailView({ task }: any) {
  const [activeTab, setActiveTab] = useState('Execution'); // Execution, Notes
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [priority, setPriority] = useState(task.priority);
  const [assignedCg, setAssignedCg] = useState(
    task.assignedCaregiverId
      ? {
          id: task.assignedCaregiverId,
          name: `${task.caregiver?.user?.firstName} ${task.caregiver?.user?.lastName}`,
        }
      : null
  );

  return (
    <div className="flex flex-col bg-white rounded-[32px] border border-slate-200 shadow-sm h-full max-h-[750px] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* 1. COMPACT CLINICAL HEADER */}
      <header className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 shrink-0">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-100">
              {task.resident?.firstName?.charAt(0)}{task.resident?.lastName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-none">{task.resident?.firstName} {task.resident?.lastName}</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Room 402 • {task.category}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Quick Lifecycle Actions */}
        <div className="flex gap-2">
          <button className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">
            Complete
          </button>
          <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase hover:bg-slate-50">
            Pend
          </button>
          <button className="px-4 py-2.5 bg-white border border-rose-100 text-rose-500 rounded-xl text-[10px] font-black uppercase hover:bg-rose-50">
            Cancel
          </button>
        </div>
      </header>

      {/* 2. SUB-NAVIGATION */}
      <nav className="px-8 border-b border-slate-100 flex gap-6 bg-white shrink-0">
        <button 
          onClick={() => setActiveTab('Execution')}
          className={`py-4 text-[10px] font-black uppercase tracking-widest relative transition-all ${activeTab === 'Execution' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          Execution
          {activeTab === 'Execution' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('Notes')}
          className={`py-4 text-[10px] font-black uppercase tracking-widest relative transition-all ${activeTab === 'Notes' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          Observations
          {activeTab === 'Notes' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
        </button>
      </nav>

      {/* 3. SCROLLABLE WORKSPACE */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        
        {/* SECTION: ASSIGNMENT & PRIORITY (The "Modifiables") */}
        <section className="grid grid-cols-2 gap-4">
          <CaregiverSelect
          value={assignedCg}
          onChange={setAssignedCg}
           />
          <PrioritySelect
          value={priority}
          onChange={() => setPriority(priority)}
           />
        </section>

        {/* SECTION: CHECKLIST */}
        {activeTab === 'Execution' && (
          <section className="space-y-4 animate-in slide-in-from-right-2 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Protocol Steps</h3>
              <button className="text-indigo-600"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2">
              {task.checklist?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 transition-colors group">
                  <div className="w-5 h-5 border-2 border-slate-200 rounded-md flex items-center justify-center group-hover:border-indigo-500 cursor-pointer">
                    {item.isCompleted && <Check className="w-3 h-3 text-emerald-500" />}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{item.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: OBSERVATIONS */}
        {activeTab === 'Notes' && (
          <section className="space-y-4 animate-in slide-in-from-right-2 duration-300">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical Narrative</h3>
             <textarea 
               placeholder="Add observation..." 
               className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium outline-none h-32 resize-none focus:bg-white transition-all"
             />
             <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">
               Post Observation
             </button>
          </section>
        )}
      </div>

      {/* 4. FOOTER INFO */}
      <footer className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center shrink-0">
        <span className="text-[9px] font-bold text-slate-400 uppercase">ID: {task.id?.slice(-8)}</span>
        <span className="text-[9px] font-black text-indigo-600 uppercase flex items-center gap-1.5">
          <Clock className="w-3 h-3" /> Due in 45m
        </span>
      </footer>
    </div>
  );
}

function CaregiverSelect({ value, onChange }: any) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchCaregivers, { data, loading }] = useLazyQuery(SEARCH_CAREGIVERS);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim() && isFocused) {
        searchCaregivers({ variables: { search: query } });
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, isFocused]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setIsFocused(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const caregivers = data?.caregiverList || [];

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">
        Assigned Provider
      </label>

      {/* TOGGLE VIEW: LABEL OR INPUT */}
      {!isFocused && value ? (
        /* --- VIEW MODE: LABEL TEXT --- */
        <div 
          onClick={() => setIsFocused(true)}
          className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-white hover:border-indigo-200 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
              {value.firstName[0]}{value.lastName[0]}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">{value.firstName} {value.lastName}</p>
              <p className="text-[9px] font-bold text-emerald-500 uppercase">Active Assignment</p>
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-rose-50 rounded-md transition-all"
          >
            <X className="w-3.5 h-3.5 text-rose-400" />
          </button>
        </div>
      ) : (
        /* --- EDIT MODE: INPUT FIELD --- */
        <div className="relative animate-in fade-in duration-200">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isFocused ? 'text-indigo-500' : 'text-slate-400'}`} />
          <input
            autoFocus={isFocused}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              setIsFocused(true);
              setOpen(true);
            }}
            placeholder={value ? `${value.firstName} ${value.lastName}` : "Search caregiver..."}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none ring-4 ring-transparent focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 animate-spin" />
          )}
        </div>
      )}

      {/* DROPDOWN RESULTS */}
      {open && isFocused && (query.length > 0 || caregivers.length > 0) && (
        <div className="absolute z-[70] mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 max-h-64 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          {caregivers.length === 0 && !loading ? (
            <div className="px-5 py-4 text-xs font-bold text-slate-400 italic">
              No medical personnel found
            </div>
          ) : (
            caregivers.map((cg: any) => (
              <button
                key={cg.id}
                onClick={() => {
                  onChange(cg);
                  setQuery("");
                  setOpen(false);
                  setIsFocused(false);
                }}
                className="w-full text-left px-5 py-3.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-between group border-b border-slate-50 last:border-0"
              >
                <span>{cg.firstName} {cg.lastName}</span>
                <Check className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100" />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
// =========================================
// HELPER COMPONENTS
// =========================================


// --- Sub-Components ---

interface PrioritySelectProps {
  value: 'LOW' | 'MEDIUM' | 'HIGH';
  onChange: (value: string) => void;
}

function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { label: 'Low', value: 'LOW', color: 'bg-slate-500', bg: 'bg-slate-50', text: 'text-slate-600' },
    { label: 'Medium', value: 'MEDIUM', color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: 'High', value: 'HIGH', color: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-600' },
  ];

  const current = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">
        Task Priority
      </label>

      {/* --- VIEW MODE: CLINICAL BADGE --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all group ${
          isOpen ? 'bg-white border-indigo-200 ring-4 ring-indigo-500/5' : `${current.bg} border-slate-100`
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${current.color} shadow-sm group-hover:scale-125 transition-transform`} />
          <span className={`text-xs font-black uppercase tracking-tight ${current.text}`}>
            {current.label} Priority
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* --- DROPDOWN SELECTION --- */}
      {isOpen && (
        <div className="absolute z-[70] mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full text-left px-5 py-3.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-between group border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${option.color}`} />
                <span className={option.value === value ? 'text-slate-900' : 'text-slate-500'}>
                  {option.label}
                </span>
              </div>
              {option.value === value && (
                <Check className="w-4 h-4 text-indigo-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DispatchDrawer({ isOpen, onClose, onSuccess }: any) {
  const [form, setForm] = useState({
    title: '',
    residentId: '',
    assignedCaregiverId: '',
    category: 'CARE',
    priority: 'MEDIUM',
    dueAt: new Date().toISOString().slice(0, 16),
    description: '',
    steps: [] as string[] // For Execution Section
  });

  const [newStep, setNewStep] = useState('');
  const [residentSearch, setResidentSearch] = useState('');
  const [caregiverSearch, setCaregiverSearch] = useState('');
  const [selectedResidentName, setSelectedResidentName] = useState('');
  const [selectedCaregiverName, setSelectedCaregiverName] = useState('');

  const { data: resData } = useQuery(SEARCH_RESIDENTS, {
    variables: { search: residentSearch },
    skip: !!form.residentId || residentSearch.length < 1
  });

  const { data: cgData } = useQuery(SEARCH_CAREGIVERS, {
    variables: { search: caregiverSearch },
    skip: !!form.assignedCaregiverId || caregiverSearch.length < 1
  });

  const [createTask, { loading }] = useMutation(CREATE_ADHOC_TASK);

  if (!isOpen) return null;

  const addStep = () => {
    if (!newStep.trim()) return;
    setForm({ ...form, steps: [...form.steps, newStep] });
    setNewStep('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask({
        variables: {
          input: {
            ...form,
            id: crypto.randomUUID(),
            dueAt: new Date(form.dueAt).toISOString(),
            status: form.assignedCaregiverId ? 'ASSIGNED' : 'PENDING'
          }
        }
      });
      onSuccess();
    } catch (err) { console.error(err); }
  };

  const residents = resData?.residentList ?? [];
  const caregivers = cgData?.caregiverList ?? [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-6xl bg-white rounded-[40px] shadow-2xl flex flex-col h-[90vh] animate-in fade-in zoom-in duration-300 overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100">
              <Plus className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Global Dispatch</h2>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Initialize Clinical Workload</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl transition-all"><X className="w-7 h-7 text-slate-400" /></button>
        </div>

        {/* WORKSPACE AREA */}
        <div className="flex-1 overflow-hidden flex bg-white">
          
          {/* LEFT SIDE: PRIMARY DATA & PROTOCOL */}
          <section className="flex-[1.5] overflow-y-auto p-12 border-r border-slate-100 space-y-12 scrollbar-hide">
            
            {/* Section: Task Definition */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">01. Task Definition</h3>
              <div className="space-y-4">
                <input
                  required
                  placeholder="Task Title (e.g. Wound Care - Grade 2)"
                  className="w-full text-3xl font-black text-slate-900 placeholder:text-slate-200 outline-none border-none p-0"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
                <textarea 
                  placeholder="Clinical notes and background information..."
                  className="w-full min-h-[100px] text-base font-medium text-slate-500 placeholder:text-slate-300 outline-none resize-none bg-slate-50/50 p-6 rounded-3xl border border-transparent focus:border-slate-100 transition-all"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            {/* Section: Execution Steps */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">02. Execution Checklist</h3>
              <div className="space-y-3">
                {form.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl group">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{step}</span>
                    </div>
                    <button 
                      onClick={() => setForm({...form, steps: form.steps.filter((_, i) => i !== idx)})}
                      className="opacity-0 group-hover:opacity-100 text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="relative group">
                   <input 
                    placeholder="Type a step and press Enter..."
                    className="w-full pl-6 pr-16 py-5 bg-white border-2 border-dashed border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-indigo-200 focus:bg-indigo-50/20 transition-all"
                    value={newStep}
                    onChange={e => setNewStep(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addStep()}
                   />
                   <button 
                    onClick={addStep}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-100"
                   >
                     <Plus className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT SIDE: LOGISTICS & SETTINGS */}
          <section className="flex-1 overflow-y-auto p-12 bg-slate-50/30 space-y-10 scrollbar-hide">
            
            {/* Section: Participants */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">03. Participants</h3>
              
              {/* Resident Select */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Resident</label>
                {form.residentId ? (
                  <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <span className="text-sm font-black text-slate-800">{selectedResidentName}</span>
                    <button onClick={() => {setForm({...form, residentId: ''}); setResidentSearch('')}} className="text-rose-500"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      placeholder="Search residents..." 
                      className="w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-indigo-300 transition-all"
                      value={residentSearch}
                      onChange={e => setResidentSearch(e.target.value)}
                    />
                    {residents.length > 0 && residentSearch && (
                      <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                        {residents.map((res: any) => (
                          <button 
                            key={res.residentId}
                            className="w-full px-5 py-3 text-left hover:bg-slate-50 text-xs font-bold"
                            onClick={() => { setForm({...form, residentId: res.residentId}); setSelectedResidentName(`${res.firstName} ${res.lastName}`); }}
                          >
                            {res.firstName} {res.lastName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Caregiver Select */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Provider (Optional)</label>
                {form.assignedCaregiverId ? (
                  <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <span className="text-sm font-black text-slate-800">{selectedCaregiverName}</span>
                    <button onClick={() => {setForm({...form, assignedCaregiverId: ''}); setCaregiverSearch('')}} className="text-rose-500"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <div className="relative">
                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      placeholder="Search staff members..." 
                      className="w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-indigo-300 transition-all"
                      value={caregiverSearch}
                      onChange={e => setCaregiverSearch(e.target.value)}
                    />
                    {caregivers.length > 0 && caregiverSearch && (
                      <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                        {caregivers.map((cg: any) => (
                          <button 
                            key={cg.id}
                            className="w-full px-5 py-3 text-left hover:bg-slate-50 text-xs font-bold"
                            onClick={() => { setForm({...form, assignedCaregiverId: cg.id}); setSelectedCaregiverName(`${cg.firstName} ${cg.lastName}`); }}
                          >
                            {cg.firstName} {cg.lastName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Section: Priority & Timing */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">04. Urgency & Timeline</h3>
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Level</label>
                    <div className="flex gap-2">
                      {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setForm({ ...form, priority: p })}
                          className={`flex-1 py-4 rounded-xl border text-[10px] font-black uppercase transition-all ${
                            form.priority === p ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-200'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Deadline</label>
                    <input 
                      type="datetime-local"
                      className="w-full px-5 py-4 bg-white border border-slate-100 rounded-xl outline-none font-bold text-sm text-slate-700 focus:border-indigo-300 transition-all"
                      value={form.dueAt}
                      onChange={e => setForm({ ...form, dueAt: e.target.value })}
                    />
                  </div>
               </div>
            </div>
          </section>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-10 border-t border-slate-100 bg-white flex justify-end items-center gap-6 shrink-0">
          <button
            onClick={onClose}
            className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors"
          >
            Discard Draft
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.residentId || !form.title}
            className="px-12 py-5 bg-slate-900 disabled:bg-slate-100 disabled:text-slate-300 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 transition-all hover:bg-black flex items-center gap-3"
          >
            {loading ? 'Executing...' : <>Confirm Dispatch <ChevronRight className="w-4 h-4" /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
