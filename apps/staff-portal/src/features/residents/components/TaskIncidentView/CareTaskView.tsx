import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client/react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
  Plus, Calendar, Filter, Search, Loader2,
  Clock, ChevronRight, ClipboardList, User,
  AlertCircle, Edit3, Trash2, Check, X,
  ArrowUpCircle, Inbox, Send, RotateCcw
} from 'lucide-react';

import { GET_TASK_LIST } from '../../graphql/queries';
import {
  COMPLETE_TASK_MUTATION,
  CANCEL_TASK_MUTATION,
  UPDATE_TASK,
  CREATE_ADHOC_TASK
} from '../../graphql/mutations';
import NotificationToast from '../../../../components/ui/NotificationToast';
import { SEARCH_CAREGIVERS } from '../../graphql/queries';

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
              {value.firstName?.[0]}{value.lastName?.[0]}
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
          {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 animate-spin" />}
        </div>
      )}

      {open && isFocused && !disabled && (query.length > 0 || caregivers.length > 0) && (
        <div className="absolute z-[70] mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 max-h-64 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          {caregivers.length === 0 && !loading ? (
            <div className="px-5 py-4 text-xs font-bold text-slate-400 italic">No medical personnel found</div>
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
const TaskSchema = Yup.object().shape({
  title: Yup.string().required('Task title is required'),
  description: Yup.string().required('General instructions are required'),
  priority: Yup.string().oneOf(['LOW', 'MEDIUM', 'HIGH']).required(),
  assignedCaregiver: Yup.object().nullable().required('You must assign a caregiver'),
  steps: Yup.array().of(Yup.string().required('Step description cannot be empty')),
  scheduleDate: Yup.string().required('Date selection is required'),
  scheduleTime: Yup.string()
    .required('Time is required')
    .test(
      'is-15-mins-ahead',
      'Time must be at least 15 minutes from now',
      function (timeValue) {
        if (!timeValue || !this.parent.scheduleDate) return false;
        const selectedDateTime = new Date(`${this.parent.scheduleDate}T${timeValue}`);
        const minTime = new Date(Date.now() + 15 * 60000);
        return selectedDateTime.getTime() >= minTime.getTime();
      }
    ),
});

const CareTaskView = ({ residentId }: { residentId: string | null }) => {
  const [selectedDateLabel, setSelectedDateLabel] = useState<'Today' | 'Tomorrow'>('Today');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<any>(null);
  
  // Notification State
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const notify = (message: string, type: 'success' | 'error' = 'success') => setNotification({ message, type });

  const getDateRange = (label: 'Today' | 'Tomorrow') => {
    const start = new Date();
    if (label === 'Tomorrow') start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  };

  const { start, end } = getDateRange(selectedDateLabel);

  const getLocalDateString = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toLocaleDateString('en-CA'); 
  };

  const todayStr = getLocalDateString(0);
  const tomorrowStr = getLocalDateString(1);

  const { data, loading, refetch } = useQuery(GET_TASK_LIST, {
    variables: {
      residentId,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      status: filterStatus === 'ALL' ? null : filterStatus
    },
    fetchPolicy: 'cache-and-network',
    skip: !residentId
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveTask(null);
  };

  const [createTask] = useMutation(CREATE_ADHOC_TASK, {
    onCompleted: () => { handleCloseModal(); refetch(); notify("Task successfully created."); },
    onError: (err) => notify(err.message, 'error')
  });

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: () => { handleCloseModal(); refetch(); notify("Task updated successfully."); },
    onError: (err) => notify(err.message, 'error')
  });

  const [completeTask] = useMutation(COMPLETE_TASK_MUTATION, {
    onCompleted: () => { handleCloseModal(); refetch(); notify("Task marked as completed."); },
    onError: (err) => notify(err.message, 'error')
  });

  const [cancelTask] = useMutation(CANCEL_TASK_MUTATION, {
    onCompleted: () => { handleCloseModal(); refetch(); notify("Task has been cancelled."); },
    onError: (err) => notify(err.message, 'error')
  });

  const tasks = data?.taskList || [];
  const isCancelled = activeTask?.status === 'CANCELLED';
  
  // Calculate if a cancelled task is eligible to be restored
  const canBeRestored = activeTask ? new Date(activeTask.dueAt).getTime() > Date.now() + 15 * 60000 : false;

  const getInitialValues = () => {
    if (activeTask) {
      const d = new Date(activeTask.dueAt);
      return {
        id: activeTask.id,
        title: activeTask.title,
        description: activeTask.description,
        priority: activeTask.priority,
        assignedCaregiver: activeTask.assignedCaregiver || null as any,
        steps: activeTask.checklist?.length ? activeTask.checklist.map((ob:any) => ob.label) : [''],
        scheduleDate: d.toLocaleDateString('en-CA'),
        scheduleTime: d.toTimeString().slice(0, 5),
        residentId: residentId,
        category: activeTask.category || 'CARE',
      };
    }
    
    return {
      title: '',
      description: '',
      priority: 'LOW',
      assignedCaregiver: null as any,
      steps: [''],
      scheduleDate: todayStr,
      scheduleTime: '',
      residentId: residentId,
      category: 'CARE',
    };
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500">
      
      <NotificationToast 
        message={notification?.message || ''} 
        type={notification?.type || 'success'} 
        onClose={() => setNotification(null)} 
      />

      <header className="shrink-0 px-8 py-5 border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between gap-10 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Schedule</span>
              <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200">
                {['Today', 'Tomorrow'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDateLabel(d as any)}
                    className={`px-5 py-1.5 text-sm font-medium rounded-md transition-all ${selectedDateLabel === d ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-8">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-800 outline-none border border-transparent hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md py-1.5 px-2 cursor-pointer transition-all"
              >
                <option value="ALL">All Tasks</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => { setActiveTask(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> <span>Add New Task</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-[1600px] mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <p className="text-sm font-medium animate-pulse">Loading schedule...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
              <Inbox className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">Empty Schedule</h3>
              <p className="text-slate-500 text-sm mt-1">No tasks are scheduled for this timeframe.</p>
              <button onClick={() => { setActiveTask(null); setIsModalOpen(true); }} className="mt-6 px-6 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">Create Task</button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm divide-y divide-slate-100 overflow-hidden">
              {tasks.map((task: any) => (
                <div
                  key={task.id}
                  onClick={() => { setActiveTask(task); setIsModalOpen(true); }}
                  className={`group flex items-center px-6 py-5 transition-all cursor-pointer border-l-4 ${
                    task.status === 'CANCELLED' ? 'bg-slate-50 border-slate-300 opacity-60' :
                    task.status === 'COMPLETED' ? 'bg-emerald-50/30 border-emerald-500 opacity-70' :
                    task.priority === 'CRITICAL' ? 'bg-rose-50/30 border-rose-500 hover:bg-rose-50' :
                    'bg-white border-transparent hover:bg-slate-50 hover:border-blue-300'
                  }`}
                >
                  <div className="w-24 shrink-0 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className={`text-sm font-semibold ${task.status === 'CANCELLED' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {new Date(task.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="w-32 shrink-0 flex flex-col gap-1.5 items-start">
                    {task.status === 'CANCELLED' && (
                       <span className="text-[9px] font-bold px-2 py-0.5 rounded-md tracking-wide uppercase bg-slate-200 text-slate-600">CANCELLED</span>
                    )}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase ${
                      task.status === 'CANCELLED' ? 'bg-slate-100 text-slate-500' :
                      task.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                      task.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex-1 px-4 min-w-0">
                    <p className={`text-sm font-semibold truncate transition-colors ${task.status === 'CANCELLED' ? 'text-slate-500 line-through' : 'text-slate-900 group-hover:text-blue-600'}`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-slate-500 truncate mt-0.5">{task.description}</p>
                  </div>
                  <div className={`w-56 shrink-0 flex items-center gap-3 ${task.status === 'CANCELLED' ? 'opacity-50' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 border border-slate-200">
                      {task.assignedCaregiver?.user?.firstName?.[0] || 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {task.assignedCaregiver?.user?.firstName} {task.assignedCaregiver?.user?.lastName}
                    </span>
                  </div>
                  <div className="w-16 shrink-0 flex justify-end">
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-3">
                  {isCancelled ? 'Task Cancelled' : activeTask ? 'Manage Task' : 'Create Care Task'}
                  {isCancelled && <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-200 text-slate-600 uppercase tracking-wider">Read Only</span>}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {activeTask ? `ID: ${activeTask.id}` : "Assign a new task to a caregiver's schedule."}
                </p>
              </div>
              <button type="button" onClick={handleCloseModal} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <Formik
              initialValues={getInitialValues()}
              validationSchema={TaskSchema}
              enableReinitialize={true}
              onSubmit={async (values) => {
                if (isCancelled) return; // Prevent submission if cancelled

                const caregiverId = values.assignedCaregiver?.id;
                const combinedDateTime = new Date(`${values.scheduleDate}T${values.scheduleTime}`).toISOString();
                const checklistInput = values.steps.map((label: string) => ({
                    id: crypto.randomUUID(),
                    label,
                    required: true,
                    done: false,
                }));

                if (activeTask) {
                  const { assignedCaregiver, scheduleDate, category, scheduleTime, steps, residentId, ...submitData } = values;
                  try {
                    await updateTask({
                      variables: {
                        input: {
                          ...submitData,
                          assignedCaregiverId: caregiverId,
                          dueAt: combinedDateTime,
                          checklist: checklistInput,
                        }
                      }
                    });
                  } catch (err) {
                    console.error("Update Error:", err);
                  }
                } else {
                  const { assignedCaregiver, scheduleDate, scheduleTime, steps, ...submitData } = values;
                  try {
                    await createTask({
                      variables: {
                        input: {
                          ...submitData,
                          assignedCaregiverId: caregiverId,
                          dueAt: combinedDateTime,
                          checklist: checklistInput,
                          status: assignedCaregiver ? 'ASSIGNED' : 'PENDING'
                        }
                      }
                    });
                  } catch (err) {
                    console.error("Dispatch Error:", err);
                  }
                }
              }}
            >
              {({ errors, touched, values, setFieldValue }) => (
                <Form className="p-8 space-y-6 overflow-y-auto bg-slate-50/50">

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Task Title</label>
                      <Field 
                        name="title" 
                        disabled={isCancelled}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm disabled:bg-slate-100 disabled:text-slate-500" 
                        placeholder="e.g., Administer Morning Medication" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Assign Caregiver</label>
                        <CaregiverSelect
                          disabled={isCancelled}
                          value={values.assignedCaregiver}
                          onChange={(selectedObject: any) => setFieldValue('assignedCaregiver', selectedObject)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
                        />
                        {errors.assignedCaregiver && touched.assignedCaregiver && <div className="text-rose-500 text-xs mt-1.5">{errors.assignedCaregiver as string}</div>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Priority Level</label>
                        <Field 
                          name="priority" 
                          as="select" 
                          disabled={isCancelled}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm appearance-none disabled:bg-slate-100 disabled:text-slate-500"
                        >
                          <option value="LOW">LOW</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="HIGH">HIGH</option>
                        </Field>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Scheduled Date</label>
                        <div className="flex gap-3">
                          <label className={`flex-1 flex items-center justify-center py-2.5 border rounded-lg transition-all ${isCancelled ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : values.scheduleDate === todayStr ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow-sm cursor-pointer' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer'}`}>
                            <Field type="radio" name="scheduleDate" value={todayStr} className="sr-only" disabled={isCancelled} />
                            Today
                          </label>
                          <label className={`flex-1 flex items-center justify-center py-2.5 border rounded-lg transition-all ${isCancelled ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : values.scheduleDate === tomorrowStr ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow-sm cursor-pointer' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer'}`}>
                            <Field type="radio" name="scheduleDate" value={tomorrowStr} className="sr-only" disabled={isCancelled} />
                            Tomorrow
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Scheduled Time</label>
                        <Field
                          name="scheduleTime"
                          type="time"
                          disabled={isCancelled}
                          className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all disabled:bg-slate-100 disabled:text-slate-500 ${errors.scheduleTime && touched.scheduleTime ? 'border-rose-500' : 'border-slate-200'}`}
                        />
                        {errors.scheduleTime && touched.scheduleTime && (
                          <div className="text-rose-500 text-xs mt-1.5 font-medium">{errors.scheduleTime as string}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-200" />

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">General Instructions</label>
                      <Field 
                        name="description" 
                        as="textarea" 
                        rows={2} 
                        disabled={isCancelled}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm resize-none disabled:bg-slate-100 disabled:text-slate-500" 
                        placeholder="Provide an overview of the task..." 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Detailed Steps</label>
                      <FieldArray name="steps">
                        {({ push, remove }) => (
                          <div className="space-y-3">
                            {values.steps.map((step: any, index: number) => (
                              <div key={index} className="flex gap-3 items-start">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-medium mt-1 ${isCancelled ? 'bg-slate-200 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <Field
                                    name={`steps.${index}`}
                                    disabled={isCancelled}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm disabled:bg-slate-100 disabled:text-slate-500"
                                    placeholder={`Step ${index + 1}`}
                                  />
                                  <ErrorMessage name={`steps.${index}`} component="div" className="text-rose-500 text-xs mt-1" />
                                </div>
                                {values.steps.length > 1 && !isCancelled && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-2.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-lg mt-0.5 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                            {!isCancelled && (
                              <button
                                type="button"
                                onClick={() => push('')}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2 ml-11"
                              >
                                <Plus className="w-4 h-4" /> Add another step
                              </button>
                            )}
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="pt-4 flex justify-between items-center border-t border-slate-200 mt-6 sticky bottom-0 bg-slate-50/90 pb-2">
                    {isCancelled ? (
                      <div className="w-full flex justify-between items-center">
                         <span className="text-sm text-slate-500 font-medium italic">Task details are read-only.</span>
                         {canBeRestored ? (
                            <button 
                              type="button" 
                              onClick={() => {
                                if(window.confirm("Are you sure you want to restore this task?")) {
                                  // Update the task status directly to PENDING to bring it back
                                  updateTask({ variables: { input: { id: activeTask.id, status: 'PENDING' } } });
                                }
                              }} 
                              className="px-5 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-all flex items-center gap-2"
                            >
                              <RotateCcw className="w-4 h-4" /> Bring Back to Life
                            </button>
                         ) : (
                            <span className="text-sm text-rose-500 font-medium">Deadline elapsed or too close to restore.</span>
                         )}
                      </div>
                    ) : activeTask ? (
                      <>
                        <button 
                          type="button" 
                          onClick={() => {
                            if (window.confirm("Are you sure you want to cancel this task?")) {
                              cancelTask({ variables: { id: activeTask.id, reason: "Manual Cancel" } });
                            }
                          }} 
                          className="text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-4 py-2 rounded-lg transition-colors"
                        >
                          Cancel Task
                        </button>
                        <div className="flex gap-3">
                          <button 
                            type="button" 
                            onClick={() => {
                              if (window.confirm("Mark this task as fully complete?")) {
                                completeTask({ variables: { input: { id: activeTask.id } } });
                              }
                            }} 
                            className="px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-all"
                          >
                            Mark Complete
                          </button>
                          <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all flex items-center gap-2">
                            <Edit3 className="w-4 h-4" /> Save Changes
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full">
                        <button type="submit" className="w-full py-3.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center gap-2">
                          <Send className="w-4 h-4" /> Create Care Task
                        </button>
                      </div>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareTaskView;