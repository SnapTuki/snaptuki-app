import { useState, useMemo, useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Activity, Loader2, Trash2, ClipboardCheck,
  Clock, Save, Info, MapPin, Briefcase, Users, X, UserPlus,
  ChevronDown, AlertCircle, ChevronRight, Check, User, CheckCircle2,
  Calendar, BarChart3, History as HistoryIcon, Filter, RefreshCcw
} from "lucide-react";
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { GET_TASK_LIST, SEARCH_CAREGIVERS, SEARCH_RESIDENTS } from '../../features/taskCenter/graphql/queries';
import { CREATE_ADHOC_TASK } from '../../features/taskCenter/graphql/mutations';
import { UPDATE_TASK } from '../../features/taskCenter/graphql/mutations';

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
                    <TaskDetailView task={selectedTask} key={selectedTask.id} onUpdate={() => refetch()}/>
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

function TaskDetailView({ task, onUpdate }: any) {
  const [cgSearch, setCgSearch] = useState('');

  const [mutationStatus, setMutationStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  const [updateTask, { loading }] = useMutation(UPDATE_TASK, {
    onCompleted: () => {
      setMutationStatus('SUCCESS');
      
      // 1. Trigger the refetch in the parent immediately
      if (onUpdate) onUpdate();

      // 2. Clear the success message after 3 seconds
      setTimeout(() => {
        setMutationStatus('IDLE');
      }, 3000);
    },
    onError: (error) => {
      setMutationStatus('ERROR');
      setErrorMessage(error.message || "Failed to update record.");
    }
  });

  // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
  const formatInitialDate = (date: any) => {
    if (!date) return '';
    const d = new Date(date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* 2. ERROR BADGE (Pinned to top if error occurs) */}
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
          caregiverName: task.assignedCaregiver
            ? `${task.assignedCaregiver.firstName} ${task.assignedCaregiver.lastName}`
            : '',
          room: task.resident?.room || '402',
          dueAt: task.dueAt ? new Date(task.dueAt).toISOString().slice(0, 16) : '',
          checklist: task.checklist?.map((ci: any) => ({
            id: ci.id,
            label: ci.label,
            required: ci.isRequired ?? true,
            done: ci.isCompleted ?? false
          })) || []
        }}
        enableReinitialize
        onSubmit={async (values) => {
          // 2. Prepare the payload
          // Ensure we don't send UI-specific fields like 'caregiverName'
          const { caregiverName, residentName, residentId,room, dueAt, ...cleanPayload } = values;
          if (!dueAt) {
            setMutationStatus('ERROR');
            setErrorMessage("A valid due date and time is required.");
            return;
          }
          await updateTask({
            variables: {
              input: {
                ...cleanPayload,
                // Ensure the date is a proper ISO string for the backend
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
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Task Editor</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                      System Reference: {task.id?.slice(-8)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Due Date Editor */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <Field
                      type="datetime-local"
                      name="dueAt"
                      className="bg-transparent border-none text-[10px] font-black uppercase outline-none text-slate-600"
                    />
                  </div>

                  <Field as="select" name="priority" className="bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 outline-none">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </Field>
                </div>
              </div>

              <Field
                name="title"
                className="w-full text-4xl font-black text-slate-900 placeholder:text-slate-200 outline-none border-none p-0 focus:ring-0 bg-transparent"
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
                    <CheckCircle2 className="w-3.5 h-3.5" /> Caregiver & Status
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-1">Lifecycle State</p>
                      <Field
                        as="select"
                        name="status"
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest outline-none"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </Field>
                    </div>

                    <div className="relative group">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-1">Assigned Provider</p>

                      {values.caregiverName ? (
                        <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-[10px] text-white font-bold">
                              {values.caregiverName.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-indigo-900">{values.caregiverName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFieldValue('assignedCaregiverId', '');
                              setFieldValue('caregiverName', '');
                            }}
                            className="p-1.5 hover:bg-indigo-100 rounded-lg text-indigo-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input
                            placeholder="Search caregiver..."
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                            value={cgSearch}
                            onChange={(e) => setCgSearch(e.target.value)}
                          />
                        </div>
                      )}
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
                  className="w-full min-h-[120px] p-8 bg-slate-50 border border-slate-100 rounded-[32px] text-base font-medium text-slate-600 outline-none focus:bg-white focus:border-indigo-100 transition-all resize-none leading-relaxed"
                  placeholder="No description provided..."
                />
              </div>

              {/* Checklist Section (Editable) */}
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
                            className="flex-1 bg-transparent border-none text-sm font-bold text-slate-700 outline-none p-0 focus:ring-0"
                          />

                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => push({ id: `new-${Date.now()}`, label: '', required: true, done: false })}
                        className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:border-indigo-200 hover:text-indigo-500 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add Protocol Step
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
            </div>

            {/* 3. FOOTER ACTIONS */}
            <footer className="p-10 border-t border-slate-100 bg-white flex items-center justify-between">
              <div className="flex gap-4">
                {/* Cancel/Discard buttons */}
              </div>

              <div className="flex items-center gap-6">
                {dirty && mutationStatus === 'IDLE' && (
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" /> Unsaved Changes
                  </span>
                )}
                <button
                  type="submit"
                  disabled={!dirty || loading}
                  className="px-12 py-4 bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-300 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 flex items-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <><Save className="w-4 h-4" /> Save Updates</>}
                </button>
              </div>
            </footer>

          </Form>
        )}
      </Formik>
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

// Validation Schema to ensure clinical data integrity
const DispatchSchema = Yup.object().shape({
  title: Yup.string().min(3, 'Title too short').required('Required'),
  residentId: Yup.string().required('Please select a resident'),
  priority: Yup.string().required(),
  dueAt: Yup.date().required('Due date is required'),
  steps: Yup.array().of(Yup.string().min(2, 'Step is too short'))
});

function DispatchDrawer({ isOpen, onClose, onSuccess }: any) {
  const [residentSearch, setResidentSearch] = useState('');
  const [caregiverSearch, setCaregiverSearch] = useState('');

  const { data: resData } = useQuery(SEARCH_RESIDENTS, {
    variables: { search: residentSearch },
  });

  const { data: cgData } = useQuery(SEARCH_CAREGIVERS, {
    variables: { search: caregiverSearch },
  });

  const [createTask, { loading }] = useMutation(CREATE_ADHOC_TASK);

  const residents = resData?.residentList ?? [];
  const caregivers = cgData?.caregiverList ?? [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />

      <Formik
        initialValues={{
          title: '',
          description: '',
          residentId: '',
          residentName: '', // UI Only
          assignedCaregiverId: '',
          caregiverName: '', // UI Only
          category: 'CARE',
          priority: 'MEDIUM',
          dueAt: new Date().toISOString().slice(0, 16),
          steps: ['Initial assessment']
        }}
        validationSchema={DispatchSchema}
        onSubmit={async (values) => {
          // 🔥 PROBLEM 2 FIX: Construct a clean input object
          // GraphQL fails if you send fields like 'residentName' that aren't in the schema.
          const checklistInput = values.steps.map(label => ({
            id: crypto.randomUUID(), // Ensure domain ID is present
            label,
            required: true
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
                  dueAt: new Date(values.dueAt).toISOString(),
                  checklist: checklistInput,
                  status: values.assignedCaregiverId ? 'ASSIGNED' : 'PENDING'
                }
              }
            });
            onSuccess();
            onClose();
          } catch (err) {
            console.error("Mutation Error Details:", err);
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="relative w-full max-w-6xl bg-white rounded-[40px] shadow-2xl flex flex-col h-[90vh] animate-in fade-in zoom-in duration-300 overflow-hidden text-slate-800">
            {/* HEADER ... (unchanged) */}
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
              {/* LEFT: CONTENT (Protocol/Checklist) ... (unchanged) */}
              <section className="flex-[1.5] overflow-y-auto p-12 border-r border-slate-100 space-y-12">
                <div className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">01. Task Definition</h3>
                  <Field
                    name="title"
                    placeholder="Task Title (e.g. Wound Care)"
                    className="w-full text-3xl font-black text-slate-900 placeholder:text-slate-200 outline-none border-none p-0"
                  />
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Clinical notes..."
                    className="w-full min-h-[100px] text-base font-medium text-slate-500 bg-slate-50/50 p-6 rounded-3xl outline-none"
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">02. Execution Checklist</h3>
                  <FieldArray name="steps">
                    {({ push, remove }) => (
                      <div className="space-y-3">
                        {values.steps.map((_, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group">
                            <span className="text-[10px] font-black text-slate-300 w-4">{index + 1}</span>
                            <Field
                              name={`steps.${index}`}
                              placeholder="Describe protocol step..."
                              className="flex-1 bg-transparent outline-none font-bold text-sm"
                            />
                            <button type="button" onClick={() => remove(index)} className="opacity-0 group-hover:opacity-100 text-rose-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push('')}
                          className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50"
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
                <div className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">03. Participants</h3>

                  {/* Resident Selection */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Resident</label>
                    {values.residentId ? (
                      <div className="flex items-center justify-between p-4 bg-white border border-indigo-100 rounded-2xl shadow-sm">
                        <span className="text-sm font-black text-slate-800">{values.residentName}</span>
                        <button type="button" onClick={() => { setFieldValue('residentId', ''); setFieldValue('residentName', ''); }} className="text-rose-500"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                          placeholder="Search residents..."
                          className="w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none shadow-sm"
                          value={residentSearch}
                          onChange={(e) => setResidentSearch(e.target.value)}
                        />
                        {residents.length > 0 && residentSearch && (
                          <div className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                            {residents.map((res: any) => (
                              <button
                                key={res.residentId} type="button"
                                className="w-full px-5 py-3 text-left hover:bg-slate-50 text-xs font-bold border-b border-slate-50 last:border-0"
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

                  {/* 🔥 PROBLEM 1 FIX: Caregiver Selection */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Caregiver</label>
                    {values.assignedCaregiverId ? (
                      <div className="flex items-center justify-between p-4 bg-white border border-emerald-100 rounded-2xl shadow-sm">
                        <span className="text-sm font-black text-slate-800">{values.caregiverName}</span>
                        <button type="button" onClick={() => { setFieldValue('assignedCaregiverId', ''); setFieldValue('caregiverName', ''); }} className="text-rose-500"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <div className="relative">
                        <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                          placeholder="Search staff members..."
                          className="w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none shadow-sm"
                          value={caregiverSearch}
                          onChange={(e) => setCaregiverSearch(e.target.value)}
                        />
                        {caregivers.length > 0 && caregiverSearch && (
                          <div className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                            {caregivers.map((cg: any) => (
                              <button
                                key={cg.id} type="button"
                                className="w-full px-5 py-3 text-left hover:bg-slate-50 text-xs font-bold border-b border-slate-50 last:border-0"
                                onClick={() => {
                                  setFieldValue('assignedCaregiverId', cg.id);
                                  setFieldValue('caregiverName', `${cg.firstName} ${cg.lastName}`);
                                  setCaregiverSearch('');
                                }}
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

                {/* TIMELINE & PRIORITY (unchanged) */}
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">04. Timeline</h3>
                  <Field
                    type="datetime-local"
                    name="dueAt"
                    className="w-full px-5 py-4 bg-white border border-slate-100 rounded-xl outline-none font-bold text-sm"
                  />
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                    <div className="flex gap-2">
                      {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                        <button
                          key={p} type="button"
                          onClick={() => setFieldValue('priority', p)}
                          className={`flex-1 py-4 rounded-xl border text-[10px] font-black uppercase transition-all ${values.priority === p ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400'
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

            {/* FOOTER */}
            <div className="p-10 border-t border-slate-100 bg-white flex justify-end items-center gap-6 shrink-0">
              <button type="button" onClick={onClose} className="text-xs font-black uppercase tracking-widest text-slate-400">Discard</button>
              <button
                type="submit"
                disabled={loading || !values.residentId}
                className="px-12 py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all disabled:bg-slate-100 flex items-center gap-3"
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