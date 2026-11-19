import { useState, useMemo, useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Search, Activity, Loader2, Ban, Save, Info, MapPin, Briefcase, X, AlertCircle, Check, User, CheckCircle2, RefreshCcw, LayoutList, CalendarDays, ChevronRight, Inbox, Plus, Pencil } from 'lucide-react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { DateTimePicker } from '../../features/taskCenter/components/DateTimePicker';
import * as Yup from 'yup';

// Added GET_TOMORROW_CARE_TASKS to your imports
import {
  GET_TODAY_CARE_TASKS,
  GET_TOMORROW_CARE_TASKS,
  SEARCH_CAREGIVERS,
  SEARCH_RESIDENTS,
  GET_CARE_TASK_DETAILS,
} from '../../features/taskCenter/graphql/queries';
import {
  CREATE_ADHOC_TASK,
  UPDATE_CARE_TASK,
  CANCEL_CARE_TASK,
  COMPLETE_CARE_TASK,
} from '../../features/taskCenter/graphql/mutations';
import { ClinicalScheduler } from '../../features/taskCenter/components/ClinicalScheduler';


type CareTask = {
  id: string;
  title: string;
  description?: string | null;
  priority?: string | null;
  status: string;
  dueTime?: string | null;
  assignedToResident?: { firstName?: string | null; lastName?: string | null } | null;
  assignedToCaregiver?: { firstName?: string | null; lastName?: string | null } | null;
};

const taskStatus = [
  { key: 'PENDING', label: 'Pending', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-800' },
  { key: 'ASSIGNED', label: 'Assigned', dot: 'bg-sky-500', badge: 'bg-sky-50 text-sky-800' },
  { key: 'COMPLETED', label: 'Completed', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-800' },
  { key: 'CANCELLED', label: 'Cancelled', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600' },
];

const personName = (person?: CareTask['assignedToResident']) =>
  [person?.firstName, person?.lastName].filter(Boolean).join(' ') || 'Not specified';

const taskTime = (value?: string | null) => {
  if (!value) return 'No time';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'No time' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function TaskCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<CareTask | null>(null);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [scheduleView, setScheduleView] = useState<'Today' | 'Tomorrow'>('Today');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data, loading, error, refetch } = useQuery(GET_TODAY_CARE_TASKS);
  const allTasks = (data?.todayCareTasks ?? []) as CareTask[];
  console.log('All tasks', allTasks);
  
  const selectedDate = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    if (scheduleView === 'Tomorrow') date.setDate(date.getDate() + 1);
    return date;
  }, [scheduleView]);

  const dayTasks = useMemo(() => {
    const end = new Date(selectedDate);
    end.setDate(end.getDate() + 1);
    return allTasks.filter(task => {
      if (!task.dueTime) return false;
      const due = new Date(task.dueTime).getTime();
      return due >= selectedDate.getTime() && due < end.getTime();
    });
  }, [allTasks, selectedDate]);

  const filteredTasks = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase();
    return dayTasks.filter(task => {
      if (statusFilter !== 'ALL' && task.status !== statusFilter) return false;
      if (!query) return true;
      return [
        task.title, task.description, personName(task.assignedToResident),
        personName(task.assignedToCaregiver), task.id,
      ].some(value => (value ?? '').toLocaleLowerCase().includes(query));
    });
  }, [dayTasks, searchTerm, statusFilter]);

  const countByStatus = (status: string) => dayTasks.filter(t => t.status === status).length;
  const displayDate = selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f9f8] font-sans text-slate-800">
      <header className="border-b border-slate-200/80 bg-white px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-teal-700">
              <Activity className="h-4 w-4" aria-hidden="true" /> CARE OPERATIONS
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Task Center</h1>
            <p className="mt-1 text-sm text-slate-500">Coordinate daily resident care and keep your team on track.</p>
          </div>
          <button type="button" onClick={() => setIsDispatchOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
            <Plus className="h-4 w-4" aria-hidden="true" /> New care task
          </button>
        </div>
      </header>

      <main className="w-full flex-1 px-5 py-7 sm:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{scheduleView === 'Today' ? "Today's care" : "Tomorrow's care"}</h2>
              <p className="mt-0.5 text-sm text-slate-500">{displayDate}</p>
            </div>
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1" aria-label="Schedule day">
              {(['Today', 'Tomorrow'] as const).map(day => (
                <button key={day} type="button" onClick={() => setScheduleView(day)}
                  aria-pressed={scheduleView === day}
                  className={'rounded-lg px-4 py-2 text-sm font-medium transition-colors ' +
                    (scheduleView === day ? 'bg-teal-50 text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800')}>
                  {day}
                </button>
              ))}
            </div>
          </div>

          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Task summary">
            {[
              { label: 'Total care tasks', count: dayTasks.length, tone: 'text-slate-900', icon: LayoutList },
              { label: 'Pending', count: countByStatus('PENDING'), tone: 'text-amber-700', icon: AlertCircle },
              { label: 'Assigned', count: countByStatus('ASSIGNED'), tone: 'text-sky-700', icon: User },
              { label: 'Completed', count: countByStatus('COMPLETED'), tone: 'text-emerald-700', icon: CheckCircle2 },
            ].map(item => (
              <div key={item.label} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-500 sm:text-sm">{item.label}</span>
                  <item.icon className={'h-4 w-4 ' + item.tone} aria-hidden="true" />
                </div>
                <div className={'mt-3 text-3xl font-semibold tabular-nums ' + item.tone}>{item.count}</div>
              </div>
            ))}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm" aria-label="Care task list">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
              <div>
                <h3 className="font-semibold text-slate-900">Care schedule</h3>
                <p className="text-xs text-slate-500">{filteredTasks.length} tasks shown</p>
              </div>
              <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                <label className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <span className="sr-only">Search care tasks</span>
                  <input value={searchTerm} onChange={event => setSearchTerm(event.target.value)}
                    placeholder="Search tasks or people"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:bg-white" />
                </label>
                <button type="button" onClick={() => void refetch()} disabled={loading} title="Refresh care tasks" aria-label="Refresh care tasks"
                  className="rounded-lg border border-slate-200 p-2.5 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50">
                  <RefreshCcw className={'h-4 w-4 ' + (loading ? 'animate-spin' : '')} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 px-4 py-3 sm:px-5" aria-label="Filter by task status">
              {[{ key: 'ALL', label: 'All', dot: '' }, ...taskStatus].map(filter => (
                <button key={filter.key} type="button" onClick={() => setStatusFilter(filter.key)}
                  aria-pressed={statusFilter === filter.key}
                  className={'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ' +
                    (statusFilter === filter.key ? 'border-teal-700 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50')}>
                  {filter.label}
                </button>
              ))}
            </div>

            {error ? (
              <div role="alert" className="border-t border-slate-100 px-6 py-12 text-center">
                <AlertCircle className="mx-auto mb-3 h-8 w-8 text-rose-500" />
                <p className="font-medium text-slate-800">We couldn't load care tasks.</p>
                <button type="button" onClick={() => void refetch()} className="mt-3 text-sm font-semibold text-teal-700 hover:underline">Try again</button>
              </div>
            ) : loading && !data ? (
              <div className="flex items-center justify-center gap-2 border-t border-slate-100 py-16 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading care tasks…
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="border-t border-slate-100 px-6 py-16 text-center">
                <Inbox className="mx-auto mb-3 h-10 w-10 text-slate-300" aria-hidden="true" />
                <h4 className="font-semibold text-slate-800">No matching care tasks</h4>
                <p className="mt-1 text-sm text-slate-500">Try another day or adjust your search and status filter.</p>
                {(statusFilter !== 'ALL' || searchTerm) && (
                  <button type="button" onClick={() => { setStatusFilter('ALL'); setSearchTerm(''); }}
                    className="mt-4 text-sm font-semibold text-teal-700 hover:underline">Clear filters</button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border-t border-slate-100">
                {filteredTasks.slice().sort((a, b) => new Date(a.dueTime ?? 0).getTime() - new Date(b.dueTime ?? 0).getTime()).map(task => {
                  const status = taskStatus.find(item => item.key === task.status);
                  const important = task.priority === 'HIGH' || task.priority === 'CRITICAL';
                  return (
                    <button key={task.id} type="button" onClick={() => setSelectedTask(task)}
                      className="group flex w-full flex-col gap-3 px-4 py-4 text-left transition-colors hover:bg-teal-50/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-600 sm:flex-row sm:items-center sm:gap-5 sm:px-5">
                      <div className="flex shrink-0 items-center gap-3 sm:w-24">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                          <CalendarDays className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <span className="text-sm font-semibold tabular-nums text-slate-800">{taskTime(task.dueTime)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-sm font-semibold text-slate-900">{task.title}</span>
                          {important && <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">{task.priority === 'CRITICAL' ? 'Critical' : 'High priority'}</span>}
                        </div>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          Resident: <span className="font-medium text-slate-700">{personName(task.assignedToResident)}</span>
                          <span className="mx-2 text-slate-300">·</span>
                          Caregiver: {task.assignedToCaregiver ? personName(task.assignedToCaregiver) : 'Not assigned'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <span className={'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ' + (status?.badge ?? 'bg-slate-100 text-slate-600')}>
                          <span className={'h-1.5 w-1.5 rounded-full ' + (status?.dot ?? 'bg-slate-400')} />
                          {status?.label ?? task.status}
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-700" aria-hidden="true" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
          {/* Future extension point: care team capacity, shift handover and calendar views. */}
        </div>
      </main>

      {selectedTask && (
        <div className="fixed inset-0 z-80 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setSelectedTask(null)} />
          <div className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
            <button type="button" aria-label="Close task details" onClick={() => setSelectedTask(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
              <X className="h-5 w-5" />
            </button>
            <TaskDetailView task={selectedTask} key={selectedTask.id} onUpdate={() => refetch()} />
          </div>
        </div>
      )}

      <DispatchDrawer isOpen={isDispatchOpen} onClose={() => setIsDispatchOpen(false)} onSuccess={() => refetch()} />
    </div>
  );
}

// Task details, mutation handlers, validation and the dispatch form remain unchanged.

function TaskDetailView({ task, onUpdate }: any) {
  // 1. Fetch fresh task details based on the passed task ID
  const { data: detailData, loading: detailLoading } = useQuery(GET_CARE_TASK_DETAILS, {
    variables: { careTaskId: task.id },
    fetchPolicy: 'network-only', // Ensures we always get the freshest data
  });

  // 2. Use fetched data if available, otherwise fallback to the basic prop data
  const activeTask = detailData?.careTaskDetails || task;

  const [mutationStatus, setMutationStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>({});
  const toggleField = (name: string) => setEditingFields(current => ({ ...current, [name]: !current[name] }));
  const editButton = (name: string, label: string) => canEdit ? (
    <button type="button" onClick={() => toggleField(name)}
      aria-label={editingFields[name] ? `Finish editing ${label}` : `Edit ${label}`}
      aria-pressed={!!editingFields[name]}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-teal-600">
      {editingFields[name] ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
    </button>
  ) : null;


  // 3. Update status checks to use activeTask
  const isPending = activeTask.status === 'PLANNED' || activeTask.status === 'ASSIGNED';
  const isCancelled = activeTask.status === 'CANCELLED' || activeTask.status === 'UNABLE_TO_COMPLETE' || activeTask.status === 'MISSED';
  const canEdit = isPending || activeTask.status === 'IN_PROGRESS';

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
      cancelTaskMutation({ variables: { id: activeTask.id, reason } });
    } else if (reason !== null) {
      alert("A reason is required to cancel a task.");
    }
  };

  const handleForceComplete = () => {
    const reason = window.prompt("Please provide a reason for force completing this task:");
    if (reason !== null && reason.trim() !== "") {
      completeTaskMutation({ variables: { input: { id: activeTask.id, reason } } });
    } else if (reason !== null) {
      alert("A reason is required to force complete.");
    }
  };

  // Show a loading state while fetching the detailed record
  if (detailLoading && !detailData) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-white">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-teal-700" />
        <p className="text-sm text-slate-500">Loading care task…</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-white">
      {mutationStatus === 'SUCCESS' && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-emerald-200 flex items-center gap-3 border border-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Task updated</span>
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
          id: activeTask.id,
          title: activeTask.title || '',
          description: activeTask.description || '',
          status: activeTask.status || 'PLANNED',
          priority: activeTask.priority || 'NORMAL',
          residentId: activeTask.residentId || '',
          residentName: activeTask.assignedToResident
            ? `${activeTask.assignedToResident?.firstName} ${activeTask.assignedToResident?.lastName}`
            : 'Unknown Resident',
          assignedCaregiverId: activeTask.assignedCaregiverId || '',
          assignedCaregiver: activeTask.assignedToCaregiver || null,
          caregiverName: activeTask.assignedToCaregiver
            ? `${activeTask.assignedToCaregiver.firstName} ${activeTask.assignedToCaregiver.lastName}`
            : '',
          room: activeTask.resident?.room || 'ERROR',
          dueTime: activeTask.dueTime,
        }}
        enableReinitialize 
        onSubmit={async (values) => {
          if (!canEdit) return;
          const { caregiverName, residentName, residentId, room, dueTime, assignedCaregiver, status, ...cleanPayload } = values;
          if (!dueTime) {
            setMutationStatus('ERROR');
            setErrorMessage("A valid due date and time is required.");
            return;
          }
          await updateTask({
            variables: {
              input: {
                ...cleanPayload,
                dueAt: new Date(values.dueTime)
              }
            }
          });
        }}
      >
        {({ values, setFieldValue, dirty }) => (
          <Form className="flex h-full flex-col">
            
            {/* 1. COMPACT HEADER */}
            <header className="shrink-0 border-b border-slate-100 bg-white px-6 pb-5 pt-14 sm:px-8">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-3 ${isCancelled ? 'bg-rose-50 text-rose-600' : 'bg-teal-50 text-teal-700'}`}>
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="flex flex-wrap items-center gap-2 text-xl font-semibold tracking-tight text-slate-900">
                      Care task
                      {isCancelled && <span className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded text-[10px] uppercase tracking-widest font-bold">Cancelled</span>}
                      {!canEdit && !isCancelled && <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] uppercase tracking-widest font-bold">Read Only</span>}
                    </h1>
                    <p className="mt-1 text-xs text-slate-500">
                      Reference: {activeTask.id?.slice(-8)}
                    </p>
                  </div>
                </div>

                <Field as="select" name="priority" aria-label="Task priority" disabled={!canEdit}
                  className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none focus:border-teal-600 disabled:opacity-60">
                  <option value="LOW">Low priority</option>
                  <option value="NORMAL">Normal priority</option>
                  <option value="HIGH">High priority</option>
                  <option value="CRITICAL">Critical priority</option>
                </Field>
              </div>

              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  {editingFields.title && canEdit ? (
                    <Field name="title" aria-label="Task name" autoFocus
                      className="w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-2xl font-semibold text-slate-900 outline-none focus:border-teal-600"
                      placeholder="Enter task name" />
                  ) : <h2 className="break-words text-2xl font-semibold leading-snug tracking-tight text-slate-900">{values.title || 'Untitled task'}</h2>}
                </div>
                {editButton('title', 'task name')}
              </div>
            </header>

            {/* 2. MAIN SCROLLABLE CONTENT */}
            <div className="flex-1 space-y-7 overflow-y-auto bg-[#fbfcfc] px-6 py-6 sm:px-8 sm:py-8">
              
              {/* Task Scheduling (Moved here for better layout) */}
              <div>
                <Field name="dueTime">
                  {({ field, form }: any) => (
                    <DateTimePicker
                      value={field.value}
                      onChange={(isoString) => form.setFieldValue('dueTime', isoString)}
                      disabled={!canEdit}
                    />
                  )}
                </Field>
              </div>

              {/* Subject & Assignments */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <User className="w-3.5 h-3.5" /> Subject & Location
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-sm font-semibold text-slate-800" title="Resident">{values.residentName}</p>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-800" title="Room">{values.room}</p>
                      </div>
                      <MapPin className="w-5 h-5 text-slate-300" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Assignments
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <CaregiverSelect
                        hideLabel
                        disabled={!canEdit}
                        value={values.assignedCaregiver}
                        onChange={(cg: any) => {
                          setFieldValue('assignedCaregiverId', cg?.id || '');
                          setFieldValue('assignedCaregiver', cg ? { id: cg.id, firstName: cg.firstName, lastName: cg.lastName } : null);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Instructions */}
              <div className="space-y-3 pb-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-end">
                    {editButton('description', 'care instructions')}
                  </div>
                  {editingFields.description && canEdit ? (
                    <Field as="textarea" name="description" aria-label="Care instructions"
                      className="min-h-32 w-full resize-y rounded-xl border border-teal-200 bg-white p-3 text-sm leading-relaxed text-slate-800 outline-none focus:border-teal-600"
                      placeholder="Enter care instructions…" />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{values.description || 'No instructions added.'}</p>
                  )}
                </div>
              </div>

            </div>

            {/* 3. FOOTER */}
            <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:px-8">
              
              {/* LEFT: Secondary Actions */}
              <div className="flex flex-wrap gap-3">
                {activeTask.status !== 'CANCELLED' && activeTask.status !== 'COMPLETED' && (
                  <>
                    <button 
                      type="button" 
                      onClick={handleCancel} 
                      className="flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50"
                    >
                      <X className="w-4 h-4" />
                      Cancel Task
                    </button>

                    <button 
                      type="button" 
                      onClick={handleForceComplete} 
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Force Complete
                    </button>
                  </>
                )}
              </div>

              {/* RIGHT: Primary Actions & Warnings */}
              <div className="ml-auto flex flex-wrap items-center gap-3">
                {dirty && mutationStatus === 'IDLE' && canEdit && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Unsaved changes</span>
                  </div>
                )}
                
                {isCancelled ? (
                  <span className="px-4 py-2 bg-slate-200 text-slate-500 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Ban className="w-4 h-4" /> Cancelled
                  </span>
                ) : (
                  canEdit && (
                    <button
                      type="submit"
                      disabled={!dirty || updateLoading}
                      className="flex items-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      {updateLoading ? (
                        <>
                          <Loader2 className="animate-spin w-4 h-4" /> 
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" /> 
                          Save changes
                        </>
                      )}
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

function CaregiverSelect({ value, onChange, disabled, hideLabel = false }: any) {
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
      {!hideLabel && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Assigned Provider</label>}

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
            aria-label="Search caregiver"
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
                      className={`h-11 rounded-xl border text-xs font-medium transition-all ${values.priority === priority
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