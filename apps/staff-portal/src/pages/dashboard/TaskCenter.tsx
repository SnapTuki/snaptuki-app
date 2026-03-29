import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  ClipboardList, 
  LayoutTemplate,
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Calendar,
  User,
  X,
  Loader2,
  Save,
  ArrowRight,
  Play,
  ChevronDown
} from "lucide-react";

// --- TYPES ---
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  assignedTo: string; // Caregiver Name
  resident: string; // Resident Name
  dueDate: string;
  isTemplate?: boolean;
}

// --- MOCK DATA ---
const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Administer Morning Medication', description: 'Insulin and blood pressure meds per schedule.', priority: 'high', status: 'completed', assignedTo: 'Sarah Miller', resident: 'John Smith', dueDate: 'Today, 08:00 AM' },
  { id: '2', title: 'Physiotherapy Assistance', description: 'Help with walking exercises in the hallway.', priority: 'medium', status: 'in_progress', assignedTo: 'Johan Lindholm', resident: 'Clara Oswald', dueDate: 'Today, 10:30 AM' },
  { id: '3', title: 'Vitals Check', description: 'Record BP, Heart Rate, and Temp.', priority: 'high', status: 'todo', assignedTo: 'Unassigned', resident: 'Eleanor Rigby', dueDate: 'Today, 12:00 PM' },
  { id: '4', title: 'Room Cleaning & Laundry', description: 'Weekly deep clean and bedding change.', priority: 'low', status: 'todo', assignedTo: 'Anna Korhonen', resident: 'Arthur Dent', dueDate: 'Tomorrow, 09:00 AM' },
  { id: '5', title: 'Lunch Preparation', description: 'Prepare pureed meals for memory care unit.', priority: 'medium', status: 'todo', assignedTo: 'Johan Lindholm', resident: 'Multiple', dueDate: 'Today, 11:30 AM' },
  { id: '6', title: 'Update Family', description: 'Call Martha\'s daughter regarding new medication.', priority: 'low', status: 'todo', assignedTo: 'Sarah Miller', resident: 'Martha Jones', dueDate: 'Today, 04:00 PM' },
];

const MOCK_TEMPLATES: Task[] = [
  { id: 'T1', title: 'Standard Admission Check', description: 'Full vitals, dietary preferences, and inventory.', priority: 'high', status: 'todo', assignedTo: '', resident: '', dueDate: '', isTemplate: true },
  { id: 'T2', title: 'Nightly Rounds', description: 'Check doors, lighting, and resident comfort.', priority: 'medium', status: 'todo', assignedTo: '', resident: '', dueDate: '', isTemplate: true },
];

// --- HELPER COMPONENTS ---
function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    'high': 'text-rose-600 bg-rose-50 border-rose-100',
    'medium': 'text-amber-600 bg-amber-50 border-amber-100',
    'low': 'text-blue-600 bg-blue-50 border-blue-100',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${styles[priority]}`}>
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { color: string, icon: any, label: string }> = {
    'todo': { color: 'text-slate-500 bg-slate-100 border-slate-200', icon: Clock, label: 'To Do' },
    'in_progress': { color: 'text-blue-700 bg-blue-100 border-blue-200', icon: ArrowRight, label: 'In Progress' },
    'completed': { color: 'text-emerald-700 bg-emerald-100 border-emerald-200', icon: CheckCircle2, label: 'Completed' },
  };
  const config = styles[status] || styles['todo'];
  const Icon = config.icon;
  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${config.color}`}>
      <Icon className="w-3 h-3" /> {config.label}
    </span>
  );
}

// --- INTERNAL COMPONENT: TASK FORM ---
const TaskSchema = Yup.object().shape({
  title: Yup.string().required('Task title is required'),
  description: Yup.string(),
  priority: Yup.string().required('Priority is required'),
  isTemplate: Yup.boolean(),
  assignedTo: Yup.string().when('isTemplate', {
    is: false,
    then: (schema) => schema.required('Assignee is required for active tasks'),
    otherwise: (schema) => schema.notRequired(),
  }),
  resident: Yup.string().when('isTemplate', {
    is: false,
    then: (schema) => schema.required('Resident is required for active tasks'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialIsTemplate?: boolean;
}

function TaskForm({ isOpen, onClose, onSubmit, initialIsTemplate = false }: TaskFormProps) {
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      priority: 'medium',
      assignedTo: '',
      resident: '',
      dueDate: '',
      isTemplate: initialIsTemplate,
    },
    enableReinitialize: true,
    validationSchema: TaskSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API
      onSubmit({ ...values, id: Math.random().toString(36).substr(2, 9), status: 'todo' });
      setSubmitting(false);
      resetForm();
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 border-l border-slate-100 flex flex-col">
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {formik.values.isTemplate ? 'Create Task Template' : 'Assign New Task'}
            </h2>
            <p className="text-sm text-slate-500">
              {formik.values.isTemplate ? 'Design a reusable care procedure' : 'Schedule and assign a care action'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
            <div>
              <p className="text-sm font-bold text-indigo-900">Save as Template</p>
              <p className="text-xs font-medium text-indigo-700/70 mt-0.5">Make this reusable for future assignments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...formik.getFieldProps('isTemplate')} checked={formik.values.isTemplate} className="sr-only peer" />
              <div className="w-11 h-6 bg-indigo-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Task Title</label>
            <input
              {...formik.getFieldProps('title')}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. Administer Medication"
            />
            {formik.touched.title && formik.errors.title && <p className="text-xs text-rose-500 ml-1 font-bold">{formik.errors.title as string}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Instructions / Description</label>
            <textarea
              {...formik.getFieldProps('description')}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Specific details about the procedure..."
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Priority Level</label>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'medium', 'high'].map((level) => (
                <label key={level} className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  formik.values.priority === level 
                    ? level === 'high' ? 'bg-rose-50 border-rose-500 text-rose-700' : level === 'medium' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                }`}>
                  <input type="radio" name="priority" value={level} onChange={formik.handleChange} className="hidden" />
                  <span className="text-xs font-bold uppercase tracking-wider">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {!formik.values.isTemplate && (
            <>
              <div className="h-px bg-slate-100 my-4" />
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Assign To</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <select {...formik.getFieldProps('assignedTo')} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all appearance-none font-medium text-slate-700">
                      <option value="">Select Caregiver...</option>
                      <option value="Sarah Miller">Sarah Miller</option>
                      <option value="Johan Lindholm">Johan Lindholm</option>
                      <option value="Anna Korhonen">Anna Korhonen</option>
                    </select>
                  </div>
                  {formik.touched.assignedTo && formik.errors.assignedTo && <p className="text-xs text-rose-500 ml-1 font-bold">{formik.errors.assignedTo as string}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Resident</label>
                    <select {...formik.getFieldProps('resident')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all appearance-none font-medium text-slate-700">
                      <option value="">Select...</option>
                      <option value="John Smith">John Smith</option>
                      <option value="Eleanor Rigby">Eleanor Rigby</option>
                      <option value="Arthur Dent">Arthur Dent</option>
                    </select>
                    {formik.touched.resident && formik.errors.resident && <p className="text-xs text-rose-500 ml-1 font-bold">{formik.errors.resident as string}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Due Date</label>
                    <input type="text" {...formik.getFieldProps('dueDate')} placeholder="e.g. Today, 2 PM" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all" />
                  </div>
                </div>
              </div>
            </>
          )}
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button 
            type="button"
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting}
            className="flex-[2] py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {formik.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {formik.values.isTemplate ? 'Save Template' : 'Assign Task'}
          </button>
        </div>
      </div>
    </>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'templates'>('active');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Filtering & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [templates, setTemplates] = useState<Task[]>(MOCK_TEMPLATES);

  // Stats
  const activeCount = tasks.filter(t => t.status !== 'completed').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const highPriorityCount = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;

  const handleFormSubmit = (data: Task) => {
    if (data.isTemplate) {
      setTemplates(prev => [data, ...prev]);
      setActiveTab('templates');
    } else {
      setTasks(prev => [data, ...prev]);
      setActiveTab('active');
    }
  };

  const clearFilters = () => {
    setFilterStatus('all');
    setFilterPriority('all');
    setSearchTerm('');
  };

  // Filter Logic
  const displayData = activeTab === 'active' ? tasks : templates;
  const filteredData = displayData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.assignedTo && item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.resident && item.resident.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    // ROOT: Fixed height, overflow-hidden to prevent the whole page from scrolling
    <div className="flex flex-col h-[calc(100vh-6rem)] min-h-[600px] overflow-hidden bg-slate-50/50">
      
      {/* Hide Scrollbar CSS Injection */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <TaskForm 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSubmit={handleFormSubmit}
        initialIsTemplate={activeTab === 'templates'}
      />

      {/* =========================================
          FIXED HEADER AREA (Will never scroll)
          ========================================= */}
      <div className="shrink-0 flex flex-col gap-5 pb-4 pt-2 z-10 bg-slate-50/50">
        
        {/* Title & Primary Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Task Center</h1>
            <p className="text-slate-500 font-medium mt-1">Coordinate care routines, track completion, and manage standard procedures.</p>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            {activeTab === 'templates' ? 'New Template' : 'Assign Task'}
          </button>
        </div>

        {/* Thin Boxed Stats */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2.5 px-4 py-2 border border-slate-200 bg-white/60 rounded-xl shadow-sm">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
               <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-slate-500 font-medium">Active: <strong className="text-slate-900 ml-0.5">{activeCount}</strong></span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 border border-slate-200 bg-white/60 rounded-xl shadow-sm">
            <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
               <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <span className="text-slate-500 font-medium">High Priority: <strong className="text-slate-900 ml-0.5">{highPriorityCount}</strong></span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 border border-slate-200 bg-white/60 rounded-xl shadow-sm">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
               <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="text-slate-500 font-medium">Completed: <strong className="text-slate-900 ml-0.5">{completedCount}</strong></span>
          </div>
        </div>

        {/* Controls: Thin Boxed Tabs & Filters */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mt-1">
          
          {/* Boxed Tabs */}
          <div className="flex w-full lg:w-auto p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            <button 
              onClick={() => setActiveTab('active')}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'active' ? 'bg-slate-100 text-blue-700' : 'bg-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ClipboardList className="w-4 h-4" /> Active Roster
            </button>
            <button 
              onClick={() => setActiveTab('templates')}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'templates' ? 'bg-slate-100 text-blue-700' : 'bg-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutTemplate className="w-4 h-4" /> Saved Templates
            </button>
          </div>

          {/* Thin Boxed Search & Filter */}
          <div className="flex w-full lg:w-auto gap-3 items-center">
            <div className="relative group w-full lg:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 focus:border-blue-300 shadow-sm rounded-xl outline-none text-slate-700 font-medium placeholder:text-slate-400 text-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border shadow-sm transition-colors ${
                isFilterOpen || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" /> Filter
              {(filterStatus !== 'all' || filterPriority !== 'all') && (
                <span className="w-2 h-2 rounded-full bg-blue-600 ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Inline Expandable Filter Panel */}
        {isFilterOpen && (
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-wrap gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
              <div className="relative">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-blue-300 transition-colors appearance-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Priority</label>
              <div className="relative">
                <select 
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-blue-300 transition-colors appearance-none"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-end flex-none pb-0.5">
                <button onClick={clearFilters} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                  Clear All
                </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================
          SCROLLABLE LIST AREA (Hidden Scrollbar)
          ========================================= */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-10">
        {filteredData.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No matches found</h3>
            <p className="text-sm text-slate-500 font-medium">Try adjusting your search or filter criteria.</p>
            {(searchTerm || filterStatus !== 'all' || filterPriority !== 'all') && (
              <button onClick={clearFilters} className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-800">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredData.map((task) => (
              <div 
                key={task.id} 
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white border border-slate-200 shadow-sm rounded-2xl hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
              >
                
                {/* Left: Title & Priority */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <PriorityBadge priority={task.priority} />
                    {task.isTemplate && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 uppercase tracking-widest">
                        Template
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">{task.title}</h3>
                  <p className="text-sm font-medium text-slate-500 truncate mt-0.5">{task.description}</p>
                </div>

                {/* Middle: Details (Active Tasks Only) */}
                {!task.isTemplate && (
                  <div className="hidden lg:flex flex-col justify-center min-w-[200px] shrink-0">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-slate-700">{task.assignedTo || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-200 text-[8px] font-black flex items-center justify-center">R</span>
                      <span className="font-medium">{task.resident}</span>
                    </div>
                  </div>
                )}

                {/* Right: Status & Actions */}
                <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-3 md:min-w-[140px] shrink-0">
                  {!task.isTemplate ? (
                    <StatusBadge status={task.status} />
                  ) : (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsDrawerOpen(true); }}
                      className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors"
                    >
                      <Play className="w-3 h-3" /> Deploy
                    </button>
                  )}
                  
                  {!task.isTemplate && task.dueDate && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <Calendar className="w-3.5 h-3.5" /> {task.dueDate}
                    </div>
                  )}
                </div>

                {/* Context Menu Action */}
                <div className="hidden md:block">
                  <button className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}