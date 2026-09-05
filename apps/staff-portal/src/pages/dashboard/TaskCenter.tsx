import { useState, useMemo, useEffect, useRef } from 'react';
import { useLazyQuery, useQuery, useMutation } from '@apollo/client/react';
import {
  Plus, Search, Activity, Loader2, Trash2, Save, Info, MapPin, Briefcase, X,
  ChevronDown, AlertCircle, Check, User, CheckCircle2, Filter, RefreshCcw,
  MoreHorizontal, ChevronUp, Inbox
} from "lucide-react";
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';

// Added GET_TOMORROW_CARE_TASKS to your imports
import { 
  GET_TODAY_CARE_TASKS, 
  GET_TOMORROW_CARE_TASKS, 
  SEARCH_CAREGIVERS, 
  SEARCH_RESIDENTS 
} from '../../features/taskCenter/graphql/queries';
import {
  CREATE_ADHOC_TASK,
  UPDATE_CARE_TASK,
  CANCEL_CARE_TASK,
  COMPLETE_CARE_TASK,
} from '../../features/taskCenter/graphql/mutations';
import { ClinicalScheduler } from '../../features/taskCenter/components/ClinicalScheduler';

const TASK_STATUS_GROUPS = [
  { key: 'PLANNED', label: 'Planned', colorClass: 'bg-slate-400', textClass: 'text-slate-600' },
  { key: 'ASSIGNED', label: 'Assigned', colorClass: 'bg-indigo-400', textClass: 'text-indigo-500' },
  { key: 'IN_PROGRESS', label: 'In Progress', colorClass: 'bg-amber-400', textClass: 'text-amber-500' },
  { key: 'COMPLETED', label: 'Completed', colorClass: 'bg-emerald-500', textClass: 'text-emerald-500' },
  { key: 'UNABLE_TO_COMPLETE', label: 'Unable to Complete', colorClass: 'bg-rose-400', textClass: 'text-rose-500' },
  { key: 'OVERDUE', label: 'Overdue', colorClass: 'bg-orange-500', textClass: 'text-orange-600' },
  { key: 'MISSED', label: 'Missed', colorClass: 'bg-red-600', textClass: 'text-red-600' }
];

export default function TaskCenter() {
  const [activeTab] = useState('Today');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);

  const [scheduleView, setScheduleView] = useState<'Today' | 'Tomorrow'>('Today');

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Query for Today (Skips if viewing Tomorrow)
  const { data: todayData, refetch: refetchToday } = useQuery(GET_TODAY_CARE_TASKS, {
    skip: scheduleView !== 'Today'
  });

  // Query for Tomorrow (Skips if viewing Today)
  const { data: tomorrowData, refetch: refetchTomorrow } = useQuery(GET_TOMORROW_CARE_TASKS, {
    skip: scheduleView !== 'Tomorrow'
  });

  // Dynamically pull from the active query result
  const allTasks = scheduleView === 'Today' 
    ? (todayData?.todayCareTasks || []) 
    : (tomorrowData?.todayCareTasks || []);

  const handleRefresh = () => {
    if (scheduleView === 'Today') {
      refetchToday();
    } else {
      refetchTomorrow();
    }
  };

  // The local date filtering is gone—we only filter by status, priority, and text search
  const filteredTasks = useMemo(() => {
    return allTasks.filter((t: any) => {
      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
      const matchesSearch = !searchTerm || t.title?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [allTasks, statusFilter, priorityFilter, searchTerm]);

  // Aggregate stats based on our filtered dataset
  const todoCount = filteredTasks.filter((t: any) => ['PLANNED', 'ASSIGNED'].includes(t.status)).length;
  const activeCount = filteredTasks.filter((t: any) => t.status === 'IN_PROGRESS').length;
  const completedCount = filteredTasks.filter((t: any) => t.status === 'COMPLETED').length;
  const issueCount = filteredTasks.filter((t: any) => ['UNABLE_TO_COMPLETE', 'OVERDUE', 'MISSED'].includes(t.status)).length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ========================================================= */}
      {/* FIXED HEADER */}
      {/* ========================================================= */}
      <header className="fixed top-0 right-0 left-0 h-16 z-40 bg-white border-b border-slate-200">
        <div className="h-full px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Task Center</h1>
              <p className="text-xs text-slate-500">Clinical Operations Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="h-10 w-10 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <RefreshCcw className="w-4 h-4 text-slate-500" />
            </button>
            <button
              onClick={() => setIsDispatchOpen(true)}
              className="h-10 px-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl flex items-center gap-2 text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* CONTENT */}
      {/* ========================================================= */}
      <main className="pt-16">
        {activeTab === 'Today' && (
          <div className="w-full">
            <div className="px-6 py-6 space-y-6">

              {/* ===================================================== */}
              {/* STICKY TOOLBAR */}
              {/* ===================================================== */}
              <div className="sticky top-16 z-40 bg-slate-50 pb-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">

                  {/* left: Search & Filters */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64 h-11 pl-10 pr-4 border border-slate-200 rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-cyan-200"
                      />
                    </div>

                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-11 pl-9 pr-8 border border-slate-200 rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-cyan-200 appearance-none text-slate-600"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="PLANNED">Planned</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="UNABLE_TO_COMPLETE">Unable to Complete</option>
                        <option value="OVERDUE">Overdue</option>
                        <option value="MISSED">Missed</option>
                      </select>
                    </div>

                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="h-11 pl-9 pr-8 border border-slate-200 rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-cyan-200 appearance-none text-slate-600"
                      >
                        <option value="ALL">All Priorities</option>
                        <option value="LOW">Low</option>
                        <option value="NORMAL">Normal</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                      </select>
                    </div>

                    <div className="flex bg-slate-100 rounded-xl p-1 ml-4">
                      <button
                        onClick={() => setScheduleView('Today')}
                        className={`h-9 px-4 rounded-lg text-sm font-medium transition-all ${
                          scheduleView === 'Today' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
                        }`}
                      >
                        Today
                      </button>
                      <button
                        onClick={() => setScheduleView('Tomorrow')}
                        className={`h-9 px-4 rounded-lg text-sm font-medium transition-all ${
                          scheduleView === 'Tomorrow' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
                        }`}
                      >
                        Tomorrow
                      </button>
                    </div>
                  </div>

                  {/* right: Stats */}
                  <div className="flex items-center gap-8">
                    <div>
                      <div className="text-xl font-semibold text-slate-900">{filteredTasks.length}</div>
                      <div className="text-xs text-slate-500">Total Tasks</div>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div>
                      <div className="text-xl font-semibold text-slate-800">{todoCount}</div>
                      <div className="text-xs text-slate-500">To Do</div>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div>
                      <div className="text-xl font-semibold text-amber-500">{activeCount}</div>
                      <div className="text-xs text-slate-500">Active</div>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div>
                      <div className="text-xl font-semibold text-rose-500">{issueCount}</div>
                      <div className="text-xs text-slate-500">Issues</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* ===================================================== */}
              {/* TASK SECTIONS */}
              {/* ===================================================== */}
              {filteredTasks.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl py-24 text-center">
                  <Inbox className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800">
                    No tasks found for {scheduleView}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">
                    Try adjusting filters or create a new task.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 pb-12">
                  {TASK_STATUS_GROUPS.map((statusGroup) => {
                    const tasksForGroup = filteredTasks.filter((t: any) => t.status === statusGroup.key);
                    
                    if (tasksForGroup.length === 0) return null;

                    return (
                      <TaskGroup
                        key={statusGroup.key}
                        title={statusGroup.label}
                        count={tasksForGroup.length}
                        tasks={tasksForGroup}
                        colorClass={statusGroup.colorClass}
                        textClass={statusGroup.textClass}
                        onRowClick={setSelectedTask}
                      />
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* TASK DETAILS DRAWER */}
      {/* ========================================================= */}
      {selectedTask && (
        <div className="fixed inset-0 z-[80] flex justify-end">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setSelectedTask(null)}
          />
          <div className="relative w-full max-w-2xl h-full bg-white shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setSelectedTask(null)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <TaskDetailView
              task={selectedTask}
              key={selectedTask.id}
              onUpdate={handleRefresh}
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DISPATCH DRAWER */}
      {/* ========================================================= */}
      <DispatchDrawer
        isOpen={isDispatchOpen}
        onClose={() => setIsDispatchOpen(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
}

// =========================================
// TASK GROUP COMPONENT
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
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setIsOpen(false)}>
          <div className={`w-1 h-5 rounded-full ${colorClass}`} />
          <span className={`text-[15px] font-bold ${textClass}`}>{title}</span>
          <span className="px-2.5 py-0.5 bg-slate-100 rounded-md text-xs font-semibold text-slate-600">{count}</span>
          <ChevronUp className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[13px] text-slate-500 font-medium">
              <th className="py-3 px-6 w-12"><div className="w-4 h-4 border-2 border-slate-200 rounded shrink-0" /></th>
              <th className="py-3 px-4 font-medium flex items-center gap-2">Task ID <ChevronDown className="w-3 h-3" /></th>
              <th className="py-3 px-4 font-medium min-w-50">Task Name <ChevronDown className="w-3 h-3 inline-block ml-1" /></th>
              <th className="py-3 px-4 font-medium min-w-37.5">Assignee <ChevronDown className="w-3 h-3 inline-block ml-1" /></th>
              <th className="py-3 px-4 font-medium min-w-37.5">Resident Name <ChevronDown className="w-3 h-3 inline-block ml-1" /></th>
              <th className="py-3 px-4 font-medium">Deadline <ChevronDown className="w-3 h-3 inline-block ml-1" /></th>
              <th className="py-3 px-4 font-medium">Priority <ChevronDown className="w-3 h-3 inline-block ml-1" /></th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => {
              

              const prioMap: Record<string, string> = {
                'CRITICAL': 'bg-rose-50 text-rose-500',
                'HIGH': 'bg-orange-50 text-orange-500',
                'NORMAL': 'bg-teal-50 text-teal-500', 
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
                    <div className="w-4 h-4 border-2 border-slate-200 rounded shrink-0 group-hover:border-slate-300" />
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-slate-500">
                    P{task.id?.slice(0, 6) || "000000"}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-slate-700 truncate max-w-62">
                    {task.title}
                  </td>
                  <td className="py-4 px-4">
                    {task.caregiver ? (
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
                
                  <td className="py-4 px-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                    {task.dueTime ? new Date(task.dueTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
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
// HELPER COMPONENTS 
// =========================================

function TaskDetailView({ task, onUpdate }: any) {
  const [mutationStatus, setMutationStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  const isPending = task.status === 'PLANNED' || task.status === 'ASSIGNED';
  const isCancelled = task.status === 'CANCELLED' || task.status === 'UNABLE_TO_COMPLETE' || task.status === 'MISSED';
  const canEdit = isPending || task.status === 'IN_PROGRESS';

  const [updateTask, { loading: updateLoading }] = useMutation(UPDATE_CARE_TASK, {
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

  const [cancelTaskMutation] = useMutation(CANCEL_CARE_TASK, {
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

  const [completeTaskMutation] = useMutation(COMPLETE_CARE_TASK, {
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

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      {mutationStatus === 'SUCCESS' && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-emerald-200 flex items-center gap-3 border border-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Clinical Record Synchronized</span>
          </div>
        </div>
      )}

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
          status: task.status || 'PLANNED',
          priority: task.priority || 'NORMAL',
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
          if (!canEdit) return; 
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
        {({ values, setFieldValue, dirty }) => (
          <Form className="flex flex-col h-full">
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
                    <option value="NORMAL">Normal</option>
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

            <div className="flex-1 overflow-y-auto p-10 space-y-12 bg-white scrollbar-hide">
              <div className="grid grid-cols-2 gap-12">
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

              <div className="space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" /> Clinical Instructions
                </h3>
                <Field
                  as="textarea"
                  name="description"
                  disabled={!canEdit}
                  className="w-full min-h-30 p-8 bg-slate-50 border border-slate-100 rounded-4xl text-base font-medium text-slate-600 outline-none focus:bg-white focus:border-indigo-100 transition-all resize-none leading-relaxed disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="No description provided..."
                />
              </div>

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
                          onClick={() => push({ label: '' })}
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
                  <p>Cancelled</p>
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
        <div className="absolute z-70 mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 max-h-64 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
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
  dueTime: Yup.date().required('Due date is required'),
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
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <Formik
        initialValues={{
          title: '',
          description: '',
          residentId: '',
          residentName: '',
          caregiverId: '',
          assignedCaregiver: null,
          priority: 'NORMAL',
          dueTime: new Date(Date.now() + 30 * 60000).toISOString(),
        }}
        validationSchema={DispatchSchema}
        onSubmit={async (values) => {
          try {
            await createTask({
              variables: {
                input: {
                  title: values.title,
                  description: values.description,
                  priority: values.priority,
                  residentId: values.residentId,
                  caregiverId: values.caregiverId || null,
                  dueTime: values.dueTime,
                  status: "ASSIGNED"
                },
              },
            });
            onSuccess();
            onClose();
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="h-16 shrink-0 border-b border-slate-200 px-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Create Task</h2>
                <p className="text-xs text-slate-500">Dispatch new care task</p>
              </div>
              <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">Task Title</label>
                <Field
                  name="title"
                  placeholder="Medication administration"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  rows={5}
                  placeholder="Clinical notes..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none resize-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">Resident</label>
                {values.residentId ? (
                  <div className="flex items-center justify-between border border-cyan-200 bg-cyan-50 rounded-xl p-3">
                    <span className="font-medium text-sm">{values.residentName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFieldValue('residentId', '');
                        setFieldValue('residentName', '');
                      }}
                    >
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      value={residentSearch}
                      onChange={(e) => setResidentSearch(e.target.value)}
                      placeholder="Search resident..."
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                    />
                    {residentSearch && residents.length > 0 && (
                      <div className="mt-2 border border-slate-200 rounded-xl overflow-hidden">
                        {residents.map((res: any) => (
                          <button
                            key={res.residentId}
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b last:border-b-0"
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
                  </>
                )}
              </div>

              <CaregiverSelect
                value={values.assignedCaregiver}
                onChange={(cg: any) => {
                  setFieldValue('caregiverId', cg?.id || '');
                  setFieldValue('assignedCaregiver', cg);
                }}
              />

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">Schedule</label>
                <ClinicalScheduler
                  value={values.dueTime}
                  onChange={(iso) => setFieldValue('dueTime', iso)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-3">Priority</label>
                <div className="grid grid-cols-4 gap-2">
                  {['LOW', 'NORMAL', 'HIGH', 'CRITICAL'].map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setFieldValue('priority', priority)}
                      className={`h-11 rounded-xl border text-xs font-medium transition-all ${
                        values.priority === priority
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-500 border-slate-200'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 p-5 bg-white flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !values.title || !values.residentId}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Create Task</>}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}