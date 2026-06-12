import { useState, useMemo, useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  Plus, Search, Activity, Loader2, Trash2, ClipboardCheck,
  Clock, Save, Info, MapPin, Briefcase, Users, X, UserPlus,
  ChevronDown, AlertCircle, ChevronRight, Check, User, CheckCircle2,
  Calendar, BarChart3, History as HistoryIcon, Filter, RefreshCcw,
  MoreHorizontal, ChevronUp, LayoutList, Kanban, CalendarDays,
  ArrowUpRight, Inbox
} from "lucide-react";
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';

import { GET_ALL_TASKS, SEARCH_CAREGIVERS, SEARCH_RESIDENTS } from '../../features/taskCenter/graphql/queries';
import { 
  CREATE_ADHOC_TASK, 
  UPDATE_TASK,
  CANCEL_TASK_MUTATION,
  COMPLETE_TASK_MUTATION,
  REACTIVATE_TASK
} from '../../features/taskCenter/graphql/mutations';
import { ClinicalScheduler } from '../../features/taskCenter/components/ClinicalScheduler';

export default function TaskCenter() {
  const [activeTab, setActiveTab] = useState('Today'); // Today, Performance, History
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);

  // Schedule View State
  const [scheduleView, setScheduleView] = useState<'Today' | 'Tomorrow'>('Today');

  // Filtering states for Today Tab
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // History states
  const [historyDate, setHistoryDate] = useState(new Date().toISOString().split('T')[0]);

  const { data, error, refetch } = useQuery(GET_ALL_TASKS, {
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

  // Group tasks by status for the new UI layout
  const pendingTasks = filteredTasks.filter((t: any) => t.status === 'PENDING');
  const assignedTasks = filteredTasks.filter((t: any) => t.status === 'ASSIGNED');
  const completedTasks = filteredTasks.filter((t: any) => t.status === 'COMPLETED');
  const cancelledTasks = filteredTasks.filter((t: any) => t.status === 'CANCELLED');

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">

      {/* HEADER SECTION (Matching screenshot layout) */}
      <div className="shrink-0 z-[50] bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Track and organize all your team's clinical projects in one place</p>
        </div>

        <div className="flex items-center gap-4">
           <div className="relative group flex items-center">
             <Search className="absolute left-3 w-4 h-4 text-slate-400" />
             <input
               type="text"
               placeholder="Search..."
               className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg w-64 outline-none focus:bg-white focus:border-slate-300 transition-all text-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
             <div className="absolute right-2 px-1.5 py-0.5 border border-slate-200 rounded text-[10px] text-slate-400 font-bold bg-white">⌘K</div>
           </div>

           <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
             <button className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-full"><Info className="w-4 h-4" /></button>
             <button className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-full"><Activity className="w-4 h-4" /></button>
           </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <main className="flex-1 flex overflow-hidden">

        {/* TODAY TAB VIEW */}
        {activeTab === 'Today' && (
          <div className="flex-1 overflow-y-auto bg-slate-50 p-8 scrollbar-hide">
            
            <div className="max-w-7xl mx-auto space-y-6">
              
              {/* Toolbar */}
              <div className="flex justify-between items-center bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search Task..." 
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm w-56 outline-none focus:border-slate-300 transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors">
                    <Filter className="w-4 h-4" /> Filter
                  </button>

                  {/* Added Schedule Toggle here to maintain logic while fitting new design */}
                  <div className="flex bg-slate-100 p-1 rounded-lg ml-2">
                    <button
                      onClick={() => setScheduleView('Today')}
                      className={`px-4 text-xs font-semibold rounded-md transition-all ${scheduleView === 'Today' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setScheduleView('Tomorrow')}
                      className={`px-4 text-xs font-semibold rounded-md transition-all ${scheduleView === 'Tomorrow' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Tomorrow
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                     <button className="flex items-center gap-2 px-4 py-1.5 bg-white shadow-sm rounded-md text-sm font-semibold text-slate-800">
                       <LayoutList className="w-4 h-4" /> List
                     </button>
                     <button className="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold text-slate-500 hover:text-slate-800">
                       <Kanban className="w-4 h-4" /> Kanban
                     </button>
                     <button className="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold text-slate-500 hover:text-slate-800">
                       <CalendarDays className="w-4 h-4" /> Calendar
                     </button>
                  </div>

                  <button
                    onClick={() => setIsDispatchOpen(true)}
                    className="bg-[#00c9c9] hover:bg-[#00b0b0] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm shadow-[#00c9c9]/30"
                  >
                    <Plus className="w-4 h-4" /> Add Task
                  </button>
                </div>
              </div>

              {filteredTasks.length === 0 ? (
                 <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">No tasks found for {scheduleView}</h3>
                    <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or dispatch a new task.</p>
                 </div>
              ) : (
                <div className="space-y-6 pb-20">
                  {/* Task Groups */}
                  {pendingTasks.length > 0 && <TaskGroup title="To Do" count={pendingTasks.length} tasks={pendingTasks} colorClass="bg-slate-800" textClass="text-slate-800" onRowClick={setSelectedTask} />}
                  {assignedTasks.length > 0 && <TaskGroup title="In Progress" count={assignedTasks.length} tasks={assignedTasks} colorClass="bg-amber-400" textClass="text-amber-500" onRowClick={setSelectedTask} />}
                  {completedTasks.length > 0 && <TaskGroup title="Completed" count={completedTasks.length} tasks={completedTasks} colorClass="bg-[#00c9c9]" textClass="text-[#00c9c9]" onRowClick={setSelectedTask} />}
                  {cancelledTasks.length > 0 && <TaskGroup title="Cancelled" count={cancelledTasks.length} tasks={cancelledTasks} colorClass="bg-rose-500" textClass="text-rose-500" onRowClick={setSelectedTask} />}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* TASK DETAIL DRAWER (Replaces the split pane to maintain full-width table view) */}
      {selectedTask && (
        <div className="fixed inset-0 z-[80] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setSelectedTask(null)} />
          <div className="w-full max-w-2xl h-full bg-white shadow-2xl relative flex flex-col animate-in slide-in-from-right-4 duration-300">
             <div className="absolute top-4 right-4 z-10">
                <button onClick={() => setSelectedTask(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                   <X className="w-5 h-5" />
                </button>
             </div>
             <TaskDetailView task={selectedTask} key={selectedTask.id} onUpdate={() => refetch()} />
          </div>
        </div>
      )}

      {/* DISPATCH DRAWER */}
      <DispatchDrawer
        isOpen={isDispatchOpen}
        onClose={() => setIsDispatchOpen(false)}
        onSuccess={() => refetch()} 
      />
    </div>
  );
}

// =========================================
// NEW: TASK GROUP COMPONENT
// =========================================
function TaskGroup({ title, count, tasks, colorClass, textClass, onRowClick }: { title: string, count: number, tasks: any[], colorClass: string, textClass: string, onRowClick: (t: any) => void }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setIsOpen(true)}>
        <div className="flex items-center gap-4">
           <div className={`w-1 h-5 rounded-full ${colorClass}`} />
           <span className={`text-[15px] font-bold ${textClass}`}>{title}</span>
           <span className="px-2.5 py-0.5 bg-slate-100 rounded-md text-xs font-semibold text-slate-600">{count}</span>
           <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setIsOpen(false)}>
           <div className={`w-1 h-5 rounded-full ${colorClass}`} />
           <span className={`text-[15px] font-bold ${textClass}`}>{title}</span>
           <span className="px-2.5 py-0.5 bg-slate-100 rounded-md text-xs font-semibold text-slate-600">{count}</span>
           <ChevronUp className="w-4 h-4 text-slate-400" />
        </div>
        <button className="text-sm font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors">
          View All <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[13px] text-slate-500 font-medium">
              <th className="py-3 px-6 w-12"><div className="w-4 h-4 border-2 border-slate-200 rounded flex-shrink-0" /></th>
              <th className="py-3 px-4 font-medium flex items-center gap-2">Task ID <ChevronDown className="w-3 h-3" /></th>
              <th className="py-3 px-4 font-medium min-w-[200px]">Task Name <ChevronDown className="w-3 h-3 inline-block ml-1" /></th>
              <th className="py-3 px-4 font-medium min-w-[150px]">Assignee <ChevronDown className="w-3 h-3 inline-block ml-1" /></th>
              <th className="py-3 px-4 font-medium min-w-[150px]">Resident Name <ChevronDown className="w-3 h-3 inline-block ml-1" /></th>
              <th className="py-3 px-4 font-medium">Progress <ChevronDown className="w-3 h-3 inline-block ml-1" /></th>
              <th className="py-3 px-4 font-medium">Deadline <ChevronDown className="w-3 h-3 inline-block ml-1" /></th>
              <th className="py-3 px-4 font-medium">Priority <ChevronDown className="w-3 h-3 inline-block ml-1" /></th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => {
              // Calculate mock progress from checklist
              let progressStr = "0%";
              if (task.status === 'COMPLETED') progressStr = "100%";
              else if (task.checklist?.length > 0) {
                const done = task.checklist.filter((c: any) => c.done).length;
                progressStr = `${Math.round((done / task.checklist.length) * 100)}%`;
              } else if (task.status === 'ASSIGNED') {
                 progressStr = "50%";
              }

              // Priority formatting
              const prioMap: Record<string, string> = {
                'HIGH': 'bg-rose-50 text-rose-500',
                'CRITICAL': 'bg-rose-50 text-rose-500',
                'MEDIUM': 'bg-teal-50 text-teal-500', // Using teal/cyan for medium as requested by screenshot
                'LOW': 'bg-purple-50 text-purple-500'
              };
              const prioClass = prioMap[task.priority] || 'bg-slate-100 text-slate-600';

              return (
                <tr 
                  key={task.id} 
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group"
                  onClick={() => onRowClick(task)}
                >
                  <td className="py-4 px-6">
                    <div className="w-4 h-4 border-2 border-slate-200 rounded flex-shrink-0 group-hover:border-slate-300" />
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-slate-500">
                    P{task.id?.slice(0,6) || "000000"}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-slate-700 truncate max-w-[250px]">
                    {task.title}
                  </td>
                  <td className="py-4 px-4">
                    {task.assignedCaregiver ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-white shrink-0 shadow-sm">
                          {task.assignedCaregiver.firstName[0]}
                        </div>
                        <span className="text-sm font-semibold text-slate-700 truncate max-w-30">
                          {task.assignedCaregiver.firstName} {task.assignedCaregiver.lastName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-slate-500 truncate max-w-45">
                    {task.assignedResident?.firstName} {task.assignedResident?.lastName}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                    {progressStr}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                    {task.dueAt ? new Date(task.dueAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${prioClass}`}>
                      {task.priority?.charAt(0) + task.priority?.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button className="p-1 border border-slate-200 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" onClick={(e) => { e.stopPropagation(); onRowClick(task); }}>
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =========================================
// HELPER COMPONENTS (Preserved entirely from original logic)
// =========================================

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

  const [reactivateTask] = useMutation(REACTIVATE_TASK, {
    onCompleted: () => {
      setMutationStatus('SUCCESS');
      setErrorMessage('Task Reactivated Successfully')
      if (onUpdate) onUpdate();
      setTimeout(() => setMutationStatus('IDLE'), 3000);
    },

    onError: (error) => {
      setMutationStatus('ERROR');
      setErrorMessage(error.message || 'Failed to Reactivate Task')
    }
  })

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
      reactivateTask({ variables: {taskId: task.id} });
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      
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
          residentId: task.residentId || '',
          residentName: `${task.assignedResident?.firstName} ${task.assignedResident?.lastName}` || 'Unknown Resident',
          assignedCaregiverId: task.assignedCaregiverId || '',
          assignedCaregiver: task.assignedCaregiver || null,
          caregiverName: task.assignedCaregiver
            ? `${task.assignedCaregiver.firstName} ${task.assignedCaregiver.lastName}`
            : '',
          room: task.resident?.room || '4002',
          dueAt: task.dueAt,
          checklist: task.checklist?.map((ci: any) => ({
            id: ci.id,
            label: ci.label,
          })) || []
        }}
        enableReinitialize
        onSubmit={async (values) => {
          if (!canEdit) return; // safety check
          const { caregiverName, residentName, residentId, room, dueAt, assignedCaregiver, status, ...cleanPayload } = values;
          if (!dueAt) {
            setMutationStatus('ERROR');
            setErrorMessage("A valid due date and time is required.");
            return;
          }
          await updateTask({
            variables: {
              input: {
                ...cleanPayload,
                dueAt: new Date(values.dueAt)
              }
            }
          });
        }}
      >
        {({ values, setFieldValue, dirty, isSubmitting }) => (
          <Form className="flex flex-col h-full">

            {/* 1. HEADER SECTION */}
            <header className="px-10 py-8 border-b border-slate-100 bg-white pt-14">
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

                <div className="flex flex-col items-end gap-2">
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
                          onClick={() => push({ label: ''})}
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