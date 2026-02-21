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
  Play
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
];

const MOCK_TEMPLATES: Task[] = [
  { id: 'T1', title: 'Standard Admission Check', description: 'Full vitals, dietary preferences, and inventory.', priority: 'high', status: 'todo', assignedTo: '', resident: '', dueDate: '', isTemplate: true },
  { id: 'T2', title: 'Nightly Rounds', description: 'Check doors, lighting, and resident comfort.', priority: 'medium', status: 'todo', assignedTo: '', resident: '', dueDate: '', isTemplate: true },
];

// --- HELPER COMPONENTS ---
function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    'high': 'bg-rose-100 text-rose-700 border-rose-200',
    'medium': 'bg-amber-100 text-amber-700 border-amber-200',
    'low': 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border ${styles[priority]}`}>
      {priority} Priority
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { color: string, icon: any, label: string }> = {
    'todo': { color: 'text-slate-500 bg-slate-100 border-slate-200', icon: Clock, label: 'To Do' },
    'in_progress': { color: 'text-blue-700 bg-blue-100 border-blue-200', icon: ArrowRight, label: 'In Progress' },
    'completed': { color: 'text-emerald-700 bg-emerald-100 border-emerald-200', icon: CheckCircle2, label: 'Completed' },
  };
  const config = styles[status];
  const Icon = config.icon;
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${config.color}`}>
      <Icon className="w-3.5 h-3.5" /> {config.label}
    </span>
  );
}

// --- INTERNAL COMPONENT: TASK FORM ---
const TaskSchema = Yup.object().shape({
  title: Yup.string().required('Task title is required'),
  description: Yup.string(),
  priority: Yup.string().required('Priority is required'),
  isTemplate: Yup.boolean(),
  // Conditional validation based on whether it's a template
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
          
          {/* Template Toggle */}
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Assign To (Caregiver)</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <select {...formik.getFieldProps('assignedTo')} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none font-medium text-slate-700">
                      <option value="">Select Caregiver...</option>
                      <option value="Sarah Miller">Sarah Miller (Head Nurse)</option>
                      <option value="Johan Lindholm">Johan Lindholm</option>
                      <option value="Anna Korhonen">Anna Korhonen</option>
                    </select>
                  </div>
                  {formik.touched.assignedTo && formik.errors.assignedTo && <p className="text-xs text-rose-500 ml-1 font-bold">{formik.errors.assignedTo as string}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Resident</label>
                    <select {...formik.getFieldProps('resident')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none font-medium text-slate-700">
                      <option value="">Select...</option>
                      <option value="John Smith">John Smith</option>
                      <option value="Eleanor Rigby">Eleanor Rigby</option>
                      <option value="Arthur Dent">Arthur Dent</option>
                    </select>
                    {formik.touched.resident && formik.errors.resident && <p className="text-xs text-rose-500 ml-1 font-bold">{formik.errors.resident as string}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Due Date</label>
                    <input type="text" {...formik.getFieldProps('dueDate')} placeholder="e.g. Today, 2 PM" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
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

  const handleDeployTemplate = (template: Task) => {
    // Open the drawer with template data, but force it to be an active task
    // In a real app, you'd populate the form and let them choose the resident/assignee
    setIsDrawerOpen(true);
  };

  // Filter based on active tab
  const displayData = activeTab === 'active' ? tasks : templates;
  const filteredData = displayData.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.assignedTo && item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.resident && item.resident.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <TaskForm 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSubmit={handleFormSubmit}
        initialIsTemplate={activeTab === 'templates'}
      />

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Task Center</h1>
          <p className="text-slate-500 font-medium mt-1">Coordinate care routines, track completion, and manage standard procedures.</p>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          {activeTab === 'templates' ? 'New Template' : 'Assign Task'}
        </button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Tasks</p>
            <p className="text-2xl font-black text-slate-900 leading-none">{activeCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">High Priority</p>
            <p className="text-2xl font-black text-rose-700 leading-none">{highPriorityCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Completed Today</p>
            <p className="text-2xl font-black text-emerald-700 leading-none">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Controls Header (Tabs & Search) */}
        <div className="border-b border-slate-100 p-2 sm:p-4 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50/50">
          
          {/* Tabs */}
          <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-full lg:w-auto">
            <button 
              onClick={() => setActiveTab('active')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'active' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ClipboardList className="w-4 h-4" /> Active Roster
            </button>
            <button 
              onClick={() => setActiveTab('templates')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'templates' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutTemplate className="w-4 h-4" /> Saved Templates
            </button>
          </div>

          {/* Search */}
          <div className="w-full lg:w-96 relative group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none outline-none text-slate-700 font-medium placeholder:text-slate-400 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* List View */}
        <div className="p-4 sm:p-6 bg-slate-50 flex-1">
          <div className="grid grid-cols-1 gap-4">
            {filteredData.length === 0 ? (
              <div className="text-center py-20">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">No {activeTab === 'active' ? 'tasks' : 'templates'} found</h3>
                <p className="text-slate-500 font-medium">Create a new one to get started.</p>
              </div>
            ) : (
              filteredData.map((task) => (
                <div key={task.id} className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6 group relative overflow-hidden">
                  
                  {/* Left Side: Title & Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <PriorityBadge priority={task.priority} />
                      {task.isTemplate && (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-indigo-700 bg-indigo-100 border border-indigo-200 uppercase tracking-widest">
                          Template
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1">{task.title}</h3>
                    <p className="text-sm font-medium text-slate-500 line-clamp-1">{task.description}</p>
                  </div>

                  {/* Middle: Assignment Data (Only for active tasks) */}
                  {!task.isTemplate && (
                    <div className="hidden lg:flex flex-col gap-2 min-w-[200px] px-6 border-l border-slate-100">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-bold text-slate-700">{task.assignedTo || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="w-4 h-4 rounded bg-slate-100 text-[9px] font-black flex items-center justify-center border border-slate-200">R</span>
                        <span className="font-medium">{task.resident}</span>
                      </div>
                    </div>
                  )}

                  {/* Right Side: Status & Actions */}
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-4 md:min-w-[150px]">
                    {!task.isTemplate ? (
                      <StatusBadge status={task.status} />
                    ) : (
                      <button 
                        onClick={() => handleDeployTemplate(task)}
                        className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors"
                      >
                        <Play className="w-4 h-4" /> Deploy Task
                      </button>
                    )}
                    
                    {!task.isTemplate && task.dueDate && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Calendar className="w-3.5 h-3.5" /> {task.dueDate}
                      </div>
                    )}
                  </div>

                  {/* Context Menu Button */}
                  <div className="absolute top-4 right-4 md:static">
                    <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}