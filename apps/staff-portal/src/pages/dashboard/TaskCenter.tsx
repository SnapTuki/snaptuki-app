import { useState, useMemo, useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  Plus, Search, Activity, Loader2, Trash2, ClipboardCheck,
  Clock, Save, Info, MapPin, Briefcase, Users, X, UserPlus,
  ChevronDown, AlertCircle, ChevronRight, Check, User, CheckCircle2,
  Calendar, BarChart3, History as HistoryIcon, Filter, RefreshCcw
} from "lucide-react";
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';

import { GET_TASK_LIST, SEARCH_CAREGIVERS, SEARCH_RESIDENTS } from '../../features/taskCenter/graphql/queries';
import { 
  CREATE_ADHOC_TASK, 
  UPDATE_TASK,
  CANCEL_TASK_MUTATION,
  COMPLETE_TASK_MUTATION
} from '../../features/taskCenter/graphql/mutations';
import { ClinicalScheduler } from '../../features/taskCenter/components/ClinicalScheduler';

export default function TaskCenter() {
  const [activeTab, setActiveTab] = useState('Today'); // Today, Performance, History
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);

  // --- NEW: Schedule View State ---
  const [scheduleView, setScheduleView] = useState<'Today' | 'Tomorrow'>('Today');

  // Filtering states for Today Tab
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // History states
  const [historyDate, setHistoryDate] = useState(new Date().toISOString().split('T')[0]);

  const { data, refetch } = useQuery(GET_TASK_LIST, {
    variables: { search: searchTerm },
  });

  const allTasks = data?.taskList || [];

  // Filtered tasks for Today View (Now with Date filtering)
  const filteredTasks = useMemo(() => {
    // Calculate date boundaries
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const tomorrowStart = todayStart + 86400000; // +1 day (24h)
    const dayAfterTomorrowStart = tomorrowStart + 86400000;

    return allTasks.filter((t: any) => {
      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
      
      // Check if task falls within selected date
      const taskTime = new Date(t.dueAt).getTime();
      const matchesDate = scheduleView === 'Today' 
        ? (taskTime >= todayStart && taskTime < tomorrowStart)
        : (taskTime >= tomorrowStart && taskTime < dayAfterTomorrowStart);

      return matchesStatus && matchesPriority && matchesDate;
    });
  }, [allTasks, statusFilter, priorityFilter, scheduleView]);

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
            <TabItem label="Schedule" active={activeTab === 'Today'} onClick={() => setActiveTab('Today')} icon={<Clock className="w-4 h-4" />} />
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
                
                {/* --- NEW: TODAY / TOMORROW TOGGLE --- */}
                <div className="flex bg-slate-200/60 p-1 rounded-xl mb-2">
                  <button
                    onClick={() => setScheduleView('Today')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${scheduleView === 'Today' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setScheduleView('Tomorrow')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${scheduleView === 'Tomorrow' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Tomorrow
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2">
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
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <Inbox className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-xs font-bold uppercase tracking-widest">No tasks for {scheduleView}</p>
                  </div>
                ) : (
                  filteredTasks.map((task: any) => (
                    <StreamItem
                      key={task.id}
                      task={task}
                      active={selectedTask?.id === task.id}
                      onClick={() => setSelectedTask(task)}
                    />
                  ))
                )}
              </div>
            </section>

            {/* RIGHT SIDE: SELECTED TASK PREVIEW/EDITOR */}
            <section className="flex-1 bg-slate-50 overflow-y-auto">
              {selectedTask ? (
                <div className="max-w-4xl mx-auto py-12 px-10">
                  <div className="">
                    <TaskDetailView task={selectedTask} key={selectedTask.id} onUpdate={() => refetch()} />
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

      <DispatchDrawer
        isOpen={isDispatchOpen}
        onClose={() => setIsDispatchOpen(false)}
        onSuccess={() => refetch()} />
    </div>
  );
}

// =========================================
// HELPER COMPONENTS
// =========================================
import { Inbox } from 'lucide-react'; // Make sure to add this to the top imports

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
        <span className={`${task.status === 'CANCELLED' ? 'text-rose-400' : ''}`}>{task.status}</span>
        <span>{new Date(task.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <h4 className={`text-sm font-black mb-2 leading-snug ${active ? 'text-white' : 'text-slate-800'} ${task.status === 'CANCELLED' ? 'line-through opacity-70' : ''}`}>
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

// ... [The rest of the file: TaskDetailView, CaregiverSelect, PrioritySelect, DispatchDrawer stay exactly the same]
// (Ensure you append the rest of the code as it was in the previous turn)

function TaskDetailView({ task, onUpdate }: any) {
  const [mutationStatus, setMutationStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  const isPending = task.status === 'PENDING';
  const isCancelled = task.status === 'CANCELLED';
  const canEdit = isPending; 
  const canRetask = isCancelled && new Date(task.dueAt).getTime() > Date.now() + 15 * 60000;

  const [updateTask, { loading: updateLoading }] = useMutation(UPDATE_TASK, {
    onCompleted: () => {
      setMutationStatus('SUCCESS');
      if (onUpdate) onUpdate();
      setTimeout(() => setMutationStatus('IDLE'), 3000);
    },
    onError: (error) => {
      setMutationStatus('ERROR');
      setErrorMessage(error.message || "Failed to update record.");
    }
  });

  const [cancelTaskMutation] = useMutation(CANCEL_TASK_MUTATION, {
    onCompleted: () => {
      setMutationStatus('SUCCESS');
      if (onUpdate) onUpdate();
      setTimeout(() => setMutationStatus('IDLE'), 3000);
    },
    onError: (error) => {
      setMutationStatus('ERROR');
      setErrorMessage(error.message || "Failed to cancel task.");
    }
  });

  const [completeTaskMutation] = useMutation(COMPLETE_TASK_MUTATION, {
    onCompleted: () => {
      setMutationStatus('SUCCESS');
      if (onUpdate) onUpdate();
      setTimeout(() => setMutationStatus('IDLE'), 3000);
    },
    onError: (error) => {
      setMutationStatus('ERROR');
      setErrorMessage(error.message || "Failed to complete task.");
    }
  });

  const handleCancel = () => {
    const reason = window.prompt("Please provide a reason for cancelling this task:");
    if (reason !== null && reason.trim() !== "") {
      cancelTaskMutation({ variables: { id: task.id, reason } });
    } else if (reason !== null) {
      alert("A reason is required to cancel a task.");
    }
  };

  const handleForceComplete = () => {
    const reason = window.prompt("Please provide a reason for force completing this task:");
    if (reason !== null && reason.trim() !== "") {
      completeTaskMutation({ variables: { input: { id: task.id, reason } } });
    } else if (reason !== null) {
      alert("A reason is required to force complete.");
    }
  };

  const handleRetask = () => {
    if (window.confirm("Are you sure you want to bring this task back to life?")) {
      updateTask({ variables: { input: { id: task.id, status: 'PENDING' } } });
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative">
      
      {/* SUCCESS NOTIFICATION OVERLAY */}
      {mutationStatus === 'SUCCESS' && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-emerald-200 flex items-center gap-3 border border-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Clinical Record Synchronized</span>
          </div>
        </div>
      )}

      {/* ERROR BADGE */}
      {mutationStatus === 'ERROR' && (
        <div className="mx-10 mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Update Failed</p>
              <p className="text-xs font-bold text-rose-900/70">{errorMessage}</p>
            </div>
          </div>
          <button onClick={() => setMutationStatus('IDLE')} className="p-2 hover:bg-rose-100 rounded-lg text-rose-400">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <Formik
        initialValues={{
          id: task.id,
          title: task.title || '',
          description: task.description || '',
          status: task.status || 'PENDING',
          priority: task.priority || 'MEDIUM',
          residentId: task.resident?.id || '',
          residentName: `${task.resident?.firstName} ${task.resident?.lastName}` || 'Unknown Resident',
          assignedCaregiverId: task.assignedCaregiverId || '',
          assignedCaregiver: task.assignedCaregiver || null,
          caregiverName: task.assignedCaregiver
            ? `${task.assignedCaregiver.firstName} ${task.assignedCaregiver.lastName}`
            : '',
          room: task.resident?.room || '402',
          dueAt: task.dueAt ? new Date(task.dueAt).toISOString() : new Date().toISOString(),
          checklist: task.checklist?.map((ci: any) => ({
            id: ci.id,
            label: ci.label,
            required: ci.isRequired ?? true,
            done: ci.isCompleted ?? false
          })) || []
        }}
        enableReinitialize
        onSubmit={async (values) => {
          if (!canEdit) return; // safety check
          const { caregiverName, residentName, residentId, room, dueAt, assignedCaregiver, ...cleanPayload } = values;
          if (!dueAt) {
            setMutationStatus('ERROR');
            setErrorMessage("A valid due date and time is required.");
            return;
          }
          await updateTask({
            variables: {
              input: {
                ...cleanPayload,
                dueAt: new Date(values.dueAt).toISOString()
              }
            }
          });
        }}
      >
        {({ values, setFieldValue, dirty, isSubmitting }) => (
          <Form className="flex flex-col h-full">

            {/* 1. HEADER SECTION */}
            <header className="px-10 py-8 border-b border-slate-100 bg-white">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isCancelled ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      Task Editor
                      {isCancelled && <span className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded text-[10px] uppercase tracking-widest font-bold">Cancelled</span>}
                      {!canEdit && !isCancelled && <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] uppercase tracking-widest font-bold">Read Only</span>}
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                      System Reference: {task.id?.slice(-8)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={!canEdit ? 'opacity-60 pointer-events-none' : ''}>
                    <ClinicalScheduler
                      value={values.dueAt}
                      onChange={(iso) => setFieldValue('dueAt', iso)}
                    />
                  </div>

                  <Field 
                    as="select" 
                    name="priority" 
                    disabled={!canEdit}
                    className="bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </Field>
                </div>
              </div>

              <Field
                name="title"
                disabled={!canEdit}
                className="w-full text-4xl font-black text-slate-900 placeholder:text-slate-200 outline-none border-none p-0 focus:ring-0 bg-transparent disabled:opacity-70"
                placeholder="Enter Task Title..."
              />
            </header>

            {/* 2. SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto p-10 space-y-12 bg-white scrollbar-hide">

              <div className="grid grid-cols-2 gap-12">
                {/* Resident & Room */}
                <div className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Subject & Location
                  </h3>

                  <div className="space-y-4">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Resident</p>
                      <p className="text-sm font-bold text-slate-800">{values.residentName}</p>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Room Assignment</p>
                        <p className="text-sm font-bold text-slate-800">{values.room}</p>
                      </div>
                      <MapPin className="w-5 h-5 text-slate-300" />
                    </div>
                  </div>
                </div>

                {/* Status & Caregiver Selector */}
                <div className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Assignments
                  </h3>

                  <div className="space-y-4">
                    <div className="relative group mt-5">
                      <CaregiverSelect
                        disabled={!canEdit}
                        value={values.assignedCaregiver} 
                        onChange={(cg: any) => {
                          setFieldValue('assignedCaregiverId', cg?.id || '');
                          setFieldValue('assignedCaregiver', cg ? {
                            id: cg.id,
                            firstName: cg.firstName,
                            lastName: cg.lastName
                          } : null);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" /> Clinical Instructions
                </h3>
                <Field
                  as="textarea"
                  name="description"
                  disabled={!canEdit}
                  className="w-full min-h-[120px] p-8 bg-slate-50 border border-slate-100 rounded-[32px] text-base font-medium text-slate-600 outline-none focus:bg-white focus:border-indigo-100 transition-all resize-none leading-relaxed disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="No description provided..."
                />
              </div>

              {/* Checklist Section */}
              <div className="space-y-6 pb-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Execution Checklist</h3>
                </div>

                <FieldArray name="checklist">
                  {({ push, remove }) => (
                    <div className="space-y-3">
                      {values.checklist.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl group transition-all hover:border-indigo-200">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                            {item.done ? '✓' : index + 1}
                          </div>

                          <Field
                            name={`checklist.${index}.label`}
                            placeholder="Instruction step..."
                            disabled={!canEdit}
                            className="flex-1 bg-transparent border-none text-sm font-bold text-slate-700 outline-none p-0 focus:ring-0 disabled:opacity-70"
                          />

                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="opacity-0 group-hover:opacity-100 p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}

                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => push({ id: `new-${Date.now()}`, label: '', required: true, done: false })}
                          className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:border-indigo-200 hover:text-indigo-500 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add Protocol Step
                        </button>
                      )}
                    </div>
                  )}
                </FieldArray>
              </div>
            </div>

            {/* 3. FOOTER ACTIONS */}
            <footer className="p-10 border-t border-slate-100 bg-white flex items-center justify-between">
              <div className="flex gap-4">
                {task.status !== 'CANCELLED' && task.status !== 'COMPLETED' && (
                  <>
                    <button type="button" onClick={handleCancel} className="text-rose-500 font-bold text-xs uppercase tracking-widest px-4 py-2 hover:bg-rose-50 rounded-lg transition-colors">
                      Cancel Task
                    </button>
                    <button type="button" onClick={handleForceComplete} className="text-emerald-600 font-bold text-xs uppercase tracking-widest px-4 py-2 hover:bg-emerald-50 rounded-lg transition-colors">
                      Force Complete
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-6">
                {dirty && mutationStatus === 'IDLE' && canEdit && (
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" /> Unsaved Changes
                  </span>
                )}
                
                {isCancelled ? (
                  canRetask ? (
                    <button
                      type="button"
                      onClick={handleRetask}
                      className="px-10 py-4 bg-indigo-600 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700"
                    >
                      Retask
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Deadline Elapsed (Cannot Retask)
                    </span>
                  )
                ) : (
                  canEdit && (
                    <button
                      type="submit"
                      disabled={!dirty || updateLoading}
                      className="px-12 py-4 bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-300 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 flex items-center gap-3"
                    >
                      {updateLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <><Save className="w-4 h-4" /> Save Updates</>}
                    </button>
                  )
                )}
              </div>
            </footer>

          </Form>
        )}
      </Formik>
    </div>
  );
}

function CaregiverSelect({ value, onChange, disabled }: any) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchCaregivers, { data, loading }] = useLazyQuery(SEARCH_CAREGIVERS);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim() && isFocused) {
        searchCaregivers({ variables: { search: query } });
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, isFocused]);

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

      {!isFocused && value ? (
        <div
          onClick={() => !disabled && setIsFocused(true)}
          className={`flex items-center justify-between p-3 border rounded-xl transition-all group ${disabled ? 'bg-slate-100 border-slate-200 opacity-80 cursor-not-allowed' : 'bg-slate-50 border-slate-100 cursor-pointer hover:bg-white hover:border-indigo-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-sm ${disabled ? 'bg-slate-400' : 'bg-indigo-600'}`}>
              {value.firstName[0]}{value.lastName[0]}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">{value.firstName} {value.lastName}</p>
              <p className={`text-[9px] font-bold uppercase ${disabled ? 'text-slate-500' : 'text-emerald-500'}`}>
                {disabled ? 'Assigned' : 'Active Assignment'}
              </p>
            </div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-rose-50 rounded-md transition-all"
            >
              <X className="w-3.5 h-3.5 text-rose-400" />
            </button>
          )}
        </div>
      ) : (
        <div className="relative animate-in fade-in duration-200">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isFocused ? 'text-indigo-500' : 'text-slate-400'}`} />
          <input
            autoFocus={isFocused}
            disabled={disabled}
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
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none ring-4 ring-transparent focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-400 disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 animate-spin" />
          )}
        </div>
      )}

      {open && isFocused && !disabled && (query.length > 0 || caregivers.length > 0) && (
        <div className="absolute z-[70] mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 max-h-64 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          {caregivers.length === 0 && !loading ? (
            <div className="px-5 py-4 text-xs font-bold text-slate-400 italic">
              No medical personnel found
            </div>
          ) : (
            caregivers.map((cg: any) => (
              <button
                key={cg.id}
                type="button"
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

interface PrioritySelectProps {
  value: 'LOW' | 'MEDIUM' | 'HIGH';
  onChange: (value: string) => void;
}

function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all group ${isOpen ? 'bg-white border-indigo-200 ring-4 ring-indigo-500/5' : `${current.bg} border-slate-100`
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

// Validation Schema
const DispatchSchema = Yup.object().shape({
  title: Yup.string().min(3, 'Title too short').required('Required'),
  residentId: Yup.string().required('Please select a resident'),
  priority: Yup.string().required(),
  dueAt: Yup.date().required('Due date is required'),
  steps: Yup.array().of(Yup.string().min(2, 'Step is too short'))
});

function DispatchDrawer({ isOpen, onClose, onSuccess }: any) {
  const [residentSearch, setResidentSearch] = useState('');

  const { data: resData } = useQuery(SEARCH_RESIDENTS, {
    variables: { search: residentSearch },
  });

  const [createTask, { loading }] = useMutation(CREATE_ADHOC_TASK);
  const residents = resData?.residentList ?? [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />

      <Formik
        initialValues={{
          title: '',
          description: '',
          residentId: '',
          residentName: '',
          assignedCaregiverId: '',
          assignedCaregiver: null, 
          category: 'CARE',
          priority: 'MEDIUM',
          dueAt: new Date(Date.now() + 30 * 60000).toISOString(),
          steps: ['Initial assessment']
        }}
        validationSchema={DispatchSchema}
        onSubmit={async (values) => {
          const checklistInput = values.steps.map(label => ({
            label,
            required: true,
          }));

          try {
            await createTask({
              variables: {
                input: {
                  title: values.title,
                  description: values.description,
                  category: values.category,
                  priority: values.priority,
                  residentId: values.residentId,
                  assignedCaregiverId: values.assignedCaregiverId || null,
                  dueAt: values.dueAt, 
                  checklist: checklistInput,
                }
              }
            });
            onSuccess();
            onClose();
          } catch (err) {
            console.error("Dispatch Error:", err);
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="relative w-full max-w-6xl bg-white rounded-[40px] shadow-2xl flex flex-col h-[90vh] animate-in fade-in zoom-in duration-300 overflow-hidden text-slate-800">
            
            {/* HEADER */}
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Global Dispatch</h2>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Initialize Clinical Workload</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl transition-all">
                <X className="w-7 h-7 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex bg-white">
              {/* LEFT: CONTENT (Protocol) */}
              <section className="flex-[1.5] overflow-y-auto p-12 border-r border-slate-100 space-y-12">
                <div className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 font-black">01. Task Definition</h3>
                  <Field
                    name="title"
                    placeholder="Task Title (e.g. Wound Care)"
                    className="w-full text-3xl font-black text-slate-900 placeholder:text-slate-200 outline-none border-none p-0"
                  />
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Clinical notes..."
                    className="w-full min-h-[100px] text-base font-medium text-slate-500 bg-slate-50/50 p-6 rounded-3xl outline-none border-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 font-black">02. Execution Checklist</h3>
                  <FieldArray name="steps">
                    {({ push, remove }) => (
                      <div className="space-y-3">
                        {values.steps.map((_, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group border border-transparent hover:border-indigo-100 transition-all">
                            <span className="text-[10px] font-black text-slate-300 w-4">{index + 1}</span>
                            <Field
                              name={`steps.${index}`}
                              placeholder="Describe protocol step..."
                              className="flex-1 bg-transparent outline-none font-bold text-sm text-slate-700"
                            />
                            <button type="button" onClick={() => remove(index)} className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push('')}
                          className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                        >
                          + Add Protocol Step
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </section>

              {/* RIGHT: LOGISTICS */}
              <section className="flex-1 overflow-y-auto p-12 bg-slate-50/30 space-y-10">
                <div className="space-y-8">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 font-black">03. Participants</h3>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Resident</label>
                    {values.residentId ? (
                      <div className="flex items-center justify-between p-4 bg-white border border-indigo-100 rounded-2xl shadow-sm animate-in fade-in slide-in-from-right-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                             <User className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-black text-slate-800">{values.residentName}</span>
                        </div>
                        <button type="button" onClick={() => { setFieldValue('residentId', ''); setFieldValue('residentName', ''); }} className="text-rose-400 hover:text-rose-600 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                          placeholder="Search residents..."
                          className="w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none shadow-sm focus:border-indigo-300 transition-all"
                          value={residentSearch}
                          onChange={(e) => setResidentSearch(e.target.value)}
                        />
                        {residents.length > 0 && residentSearch && (
                          <div className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                            {residents.map((res: any) => (
                              <button
                                key={res.residentId} type="button"
                                className="w-full px-5 py-3 text-left hover:bg-slate-50 text-xs font-bold border-b border-slate-50 last:border-0 hover:text-indigo-600 transition-colors"
                                onClick={() => {
                                  setFieldValue('residentId', res.residentId);
                                  setFieldValue('residentName', `${res.firstName} ${res.lastName}`);
                                  setResidentSearch('');
                                }}
                              >
                                {res.firstName} {res.lastName}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <CaregiverSelect
                    value={values.assignedCaregiver}
                    onChange={(cg: any) => {
                      setFieldValue('assignedCaregiverId', cg?.id || '');
                      setFieldValue('assignedCaregiver', cg);
                    }}
                  />
                </div>

                <div className="space-y-8 pt-8 border-t border-slate-100">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 font-black">04. Timeline & Priority</h3>
                  
                  <ClinicalScheduler
                    value={values.dueAt}
                    onChange={(iso) => setFieldValue('dueAt', iso)}
                  />
                  
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Level</label>
                    <div className="flex gap-2">
                      {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                        <button
                          key={p} type="button"
                          onClick={() => setFieldValue('priority', p)}
                          className={`flex-1 py-4 rounded-xl border text-[10px] font-black uppercase transition-all duration-200 ${
                            values.priority === p 
                              ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200' 
                              : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                            }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="p-10 border-t border-slate-100 bg-white flex justify-end items-center gap-6 shrink-0">
              <button 
                type="button" 
                onClick={onClose} 
                className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={loading || !values.residentId || !values.title}
                className="px-12 py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 transition-all disabled:bg-slate-100 disabled:text-slate-300 flex items-center gap-3 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Confirm Dispatch'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}