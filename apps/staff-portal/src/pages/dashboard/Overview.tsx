import React, { useState } from 'react';
import { 
  AlertOctagon, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  X,
  FileWarning,
  User,
  Activity,
  RotateCcw,
  Check,
  Loader2,
  Zap,
  ClipboardType,
  Megaphone,
  Users,
  Siren,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql, type TypedDocumentNode } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';

/**
 * --- TYPESCRIPT INTERFACES ---
 */
interface TriageTask {
  id: string;
  title: string;
  priority: string;
  dueAt: string;
  category: string;
  completionNotes?: string[] | null;
  resident?: { firstName: string; lastName: string } | null;
  assignedCaregiver?: { firstName: string; lastName: string } | null;
}

interface Incident {
  id: string;
  type: 'FALL' | 'MED_ERROR' | 'BEHAVIORAL' | 'OTHER';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  reportedAt: string;
  description: string;
  status: 'UNRESOLVED' | 'UNDER_REVIEW';
  resident: { firstName: string; lastName: string; room: string };
  reportedBy: { firstName: string; lastName: string };
}

interface TriageDashboardData {
  overdueTasks: TriageTask[];
  cancelledTasks: TriageTask[];
}

/**
 * --- GRAPHQL OPERATIONS ---
 */
const GET_TRIAGE_DASHBOARD: TypedDocumentNode<TriageDashboardData> = gql`
  query GetTriageDashboard {
    overdueTasks: taskList(status: "MISSED") {
      id title priority dueAt category
      resident { firstName lastName }
      assignedCaregiver { firstName lastName }
    }
    cancelledTasks: taskList(status: "CANCELLED") {
      id title priority dueAt category completionNotes
      resident { firstName lastName }
      assignedCaregiver { firstName lastName }
    }
  }
`;

const CANCEL_TASK_MUTATION = gql`
  mutation CancelTask($id: String!, $reason: String!) {
    cancelTask(id: $id, reason: $reason) { id status }
  }
`;

const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) { id status dueAt assignedCaregiverId }
  }
`;

/**
 * --- HELPER UI COMPONENTS ---
 */
function StatusBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    URGENT: 'bg-red-100 text-red-700 border-red-200',
    HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
    MEDIUM: 'bg-blue-100 text-blue-700 border-blue-200',
    LOW: 'bg-slate-100 text-slate-700 border-slate-200',
    CRITICAL: 'bg-rose-600 text-white border-rose-700 animate-pulse', // Added for incidents
  };
  const style = styles[priority] || styles.LOW;
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${style}`}>
      {priority}
    </span>
  );
}

function QuickActionButton({ icon: Icon, label, onClick, colorClass }: { icon: any, label: string, onClick: () => void, colorClass: string }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-slate-300 transition-all group"
    >
      <div className={`p-3 rounded-full mb-3 transition-colors ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{label}</span>
    </button>
  );
}

/**
 * --- MAIN PAGE COMPONENT ---
 */
export const Overview = () => {
  const [activeModal, setActiveModal] = useState<'REASSIGN' | 'CANCEL' | 'RESCHEDULE' | 'REVIEW_INCIDENT' | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // 1. Fetch real data for tasks from the backend
  const { data, loading, error, refetch } = useQuery(GET_TRIAGE_DASHBOARD, {
    fetchPolicy: 'cache-and-network',
  });

  const [cancelTask] = useMutation(CANCEL_TASK_MUTATION);
  const [updateTask] = useMutation(UPDATE_TASK_MUTATION);

  // 2. MOCK DATA: Active Incidents for today (Awaiting Backend Endpoint)
  const mockIncidents: Incident[] = [
    {
      id: 'inc_101',
      type: 'FALL',
      severity: 'CRITICAL',
      reportedAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
      description: 'Found on floor next to bed. Conscious but complaining of hip pain. Vitals stable.',
      status: 'UNRESOLVED',
      resident: { firstName: 'Elsa', lastName: 'Niemi', room: '204B' },
      reportedBy: { firstName: 'Sarah', lastName: 'Jenkins' }
    },
    {
      id: 'inc_102',
      type: 'BEHAVIORAL',
      severity: 'HIGH',
      reportedAt: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
      description: 'Severe agitation during lunch. Threw tray, refused redirection from staff.',
      status: 'UNDER_REVIEW',
      resident: { firstName: 'Lars', lastName: 'Olsen', room: '110A' },
      reportedBy: { firstName: 'Mikko', lastName: 'Lehtonen' }
    }
  ];

  // 3. Map backend data
  const triageData = {
    overdueTasks: data?.overdueTasks || [],
    cancelledTasks: data?.cancelledTasks || [],
    incidents: mockIncidents // Injected mock data here
  };

  const openModal = (type: 'REASSIGN' | 'CANCEL' | 'RESCHEDULE' | 'REVIEW_INCIDENT', item: any) => {
    setSelectedItem(item);
    setActiveModal(type);
  };

  // --- FORMIK: Cancel Task Form ---
  const cancelFormik = useFormik({
    initialValues: { reason: '' },
    validationSchema: Yup.object({
      reason: Yup.string().required('A cancellation reason is required.'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await cancelTask({ variables: { id: selectedItem.id, reason: values.reason } });
        await refetch();
        setActiveModal(null);
        resetForm();
      } catch (err) { console.error("Failed to cancel task", err); }
    },
  });

  // --- FORMIK: Reschedule Task Form ---
  const rescheduleFormik = useFormik({
    initialValues: { newDueAt: '', caregiverId: '' },
    validationSchema: Yup.object({
      newDueAt: Yup.string().required('Please select a new time.'),
      caregiverId: Yup.string().required('Please assign a caregiver.'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const [hours, minutes] = values.newDueAt.split(':');
        const newDate = new Date();
        newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
        await updateTask({
          variables: { input: { id: selectedItem.id, dueAt: newDate.toISOString(), assignedCaregiverId: values.caregiverId } }
        });
        await refetch();
        setActiveModal(null);
        resetForm();
      } catch (err) { console.error("Failed to reschedule task", err); }
    },
  });

  // --- FORMIK: Review Incident Form (MOCK) ---
  const incidentFormik = useFormik({
    initialValues: { actionTaken: '' },
    validationSchema: Yup.object({
      actionTaken: Yup.string().required('Please log the action taken to resolve this incident.'),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log(`Incident ${selectedItem.id} marked as resolved with note: ${values.actionTaken}`);
      // In future: await resolveIncidentMutation(...)
      setActiveModal(null);
      resetForm();
    },
  });

  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center border border-red-200 bg-red-50 text-red-600 rounded-xl">
        Failed to load Triage Center data. Please refresh the page.
      </div>
    );
  }

  const totalActionItems = triageData.overdueTasks.length + triageData.cancelledTasks.length + triageData.incidents.length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* 1. Header & System Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Triage Center</h1>
          <p className="text-slate-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-FI', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg shadow-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-semibold text-sm">Syncing with facility...</span>
          </div>
        ) : totalActionItems === 0 ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold text-sm">All Clear - Zero Action Items</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg shadow-sm">
            <Siren className="w-5 h-5 animate-pulse" />
            <span className="font-semibold text-sm">{totalActionItems} Action Items Pending</span>
          </div>
        )}
      </div>

      {/* 2. QUICK ACTION PANEL */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionButton 
          icon={Zap} 
          label="Dispatch Urgent" 
          colorClass="bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
          onClick={() => console.log('Open Urgent Task Form')} 
        />
        <QuickActionButton 
          icon={ClipboardType} 
          label="Log Incident" 
          colorClass="bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white"
          onClick={() => console.log('Open Incident Form')} 
        />
        <QuickActionButton 
          icon={Megaphone} 
          label="Broadcast Shift" 
          colorClass="bg-indigo-100 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white"
          onClick={() => console.log('Open Broadcast Form')} 
        />
        <QuickActionButton 
          icon={Users} 
          label="On-Duty Roster" 
          colorClass="bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white"
          onClick={() => console.log('Open Roster Modal')} 
        />
      </section>

      {/* 3. CRITICAL INCIDENTS (Full Width Section - Only shows if incidents exist) */}
      {triageData.incidents.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-rose-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-rose-600" /> 
              Active Clinical Incidents
              <span className="bg-rose-100 text-rose-700 text-xs py-0.5 px-2 rounded-full ml-2">{triageData.incidents.length}</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {triageData.incidents.map((incident) => (
              <div key={incident.id} className="bg-white border-2 border-rose-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
                
                <div className="flex justify-between items-start mb-3">
                  <StatusBadge priority={incident.severity} />
                  <div className="text-rose-600 text-xs font-bold flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5" /> 
                    {Math.round((Date.now() - new Date(incident.reportedAt).getTime()) / 60000)} mins ago
                  </div>
                </div>
                
                <h3 className="font-bold text-slate-900 text-lg">{incident.type.replace('_', ' ')}: {incident.resident.firstName} {incident.resident.lastName}</h3>
                <p className="text-sm font-semibold text-slate-500 mb-3">Room {incident.resident.room}</p>
                
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-700 mb-4">
                  "{incident.description}"
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">Logged by {incident.reportedBy.firstName}</span>
                  <button onClick={() => openModal('REVIEW_INCIDENT', incident)} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm">
                    Review Action <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. TASK BACKLOG (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        
        {/* LEFT COLUMN: Overdue Tasks */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-orange-600" /> 
              Overdue Tasks
              <span className="bg-orange-100 text-orange-700 text-xs py-0.5 px-2 rounded-full ml-2">{triageData.overdueTasks.length}</span>
            </h2>
          </div>

          {loading ? (
             <div className="p-8 border border-dashed border-slate-200 rounded-xl flex justify-center items-center">
               <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
             </div>
          ) : triageData.overdueTasks.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-slate-500">
              No overdue tasks.
            </div>
          ) : (
            <div className="space-y-3">
              {triageData.overdueTasks.map((task: any) => (
                <div key={task.id} className="bg-white border border-orange-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                  
                  <div className="flex justify-between items-start mb-3">
                    <StatusBadge priority={task.priority} />
                    <div className="flex items-center text-orange-600 text-xs font-bold gap-1 bg-orange-50 px-2 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5" /> 
                      Late
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 text-base">{task.title}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-slate-600 flex items-center gap-1.5 font-medium">
                      <User className="w-4 h-4 text-slate-400" /> Resident: {task.resident?.firstName} {task.resident?.lastName}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-slate-400" /> Assigned: {task.assignedCaregiver?.firstName} {task.assignedCaregiver?.lastName}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                    <button onClick={() => openModal('REASSIGN', task)} className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-2 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2">
                      <UserPlus className="w-4 h-4" /> Reassign
                    </button>
                    <button onClick={() => openModal('CANCEL', task)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-2 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: Cancelled Tasks */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-purple-600" /> 
              Task Review Required
              <span className="bg-purple-100 text-purple-700 text-xs py-0.5 px-2 rounded-full ml-2">{triageData.cancelledTasks.length}</span>
            </h2>
          </div>

          {loading ? (
             <div className="p-8 border border-dashed border-slate-200 rounded-xl flex justify-center items-center">
               <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
             </div>
          ) : triageData.cancelledTasks.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-slate-500">
              No tasks require review.
            </div>
          ) : (
            <div className="space-y-3">
              {triageData.cancelledTasks.map((task: any) => (
                <div key={task.id} className="bg-white border border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                  
                  <div className="flex justify-between items-start mb-3">
                    <StatusBadge priority={task.priority} />
                    <div className="text-slate-500 text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 
                      Orig. Due: {new Date(task.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 text-base line-through opacity-80">{task.title}</h3>
                  
                  <div className="mt-3 p-3 bg-purple-50 border border-purple-100 rounded-lg">
                    <p className="text-xs font-bold text-purple-800 uppercase mb-1">Cancellation Reason</p>
                    <p className="text-sm text-purple-900 font-medium italic">
                      "{task.completionNotes?.[0] || 'No reason provided.'}"
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                    <button className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 py-2 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2 shadow-sm">
                      <Check className="w-4 h-4 text-emerald-600" /> Ack
                    </button>
                    <button onClick={() => openModal('RESCHEDULE', task)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white border border-purple-700 py-2 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2 shadow-sm">
                      <RotateCcw className="w-4 h-4" /> Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* --- FORMIK MODALS --- */}
      
      {/* 1. Incident Review Modal */}
      {activeModal === 'REVIEW_INCIDENT' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-rose-100 rounded-full text-rose-600"><ShieldAlert className="w-6 h-6" /></div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Resolve Incident</h3>
                <p className="text-sm font-medium text-slate-500">{selectedItem?.type.replace('_', ' ')} - {selectedItem?.resident.firstName} {selectedItem?.resident.lastName}</p>
              </div>
            </div>
            
            <form onSubmit={incidentFormik.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Action Taken & Review Notes</label>
                <textarea 
                  name="actionTaken"
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 transition-all text-sm ${incidentFormik.errors.actionTaken && incidentFormik.touched.actionTaken ? 'border-red-300 focus:ring-red-500/20 bg-red-50' : 'border-slate-300 focus:ring-rose-500/20 bg-white'}`}
                  placeholder="E.g., Resident assessed by RN, family notified, fall protocol initiated..."
                  value={incidentFormik.values.actionTaken}
                  onChange={incidentFormik.handleChange}
                  onBlur={incidentFormik.handleBlur}
                />
                {incidentFormik.errors.actionTaken && incidentFormik.touched.actionTaken && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{incidentFormik.errors.actionTaken}</p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-colors shadow-sm">Mark as Resolved</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Cancel Task Modal */}
      {activeModal === 'CANCEL' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Cancel Task</h3>
            <p className="text-sm text-slate-500 mb-5">You are about to cancel <strong>{selectedItem?.title}</strong> for {selectedItem?.resident?.firstName}.</p>
            <form onSubmit={cancelFormik.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Cancellation Reason</label>
                <textarea 
                  name="reason"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-blue-500/20 outline-none text-sm"
                  value={cancelFormik.values.reason}
                  onChange={cancelFormik.handleChange}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg">Abort</button>
                <button type="submit" className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-lg">Confirm Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Reschedule Task Modal */}
      {activeModal === 'RESCHEDULE' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Reschedule Task</h3>
            <p className="text-sm text-slate-500 mb-5">Create a new instance of <strong>{selectedItem?.title}</strong>.</p>
            <form onSubmit={rescheduleFormik.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">New Target Time</label>
                <input 
                  type="time"
                  name="newDueAt"
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 outline-none text-sm"
                  value={rescheduleFormik.values.newDueAt}
                  onChange={rescheduleFormik.handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Assign Caregiver</label>
                <select 
                  name="caregiverId"
                  className="w-full px-3 py-2.5 border rounded-lg border-slate-300 outline-none text-sm"
                  value={rescheduleFormik.values.caregiverId}
                  onChange={rescheduleFormik.handleChange}
                >
                  <option value="" disabled>-- Select Caregiver --</option>
                  <option value="user_123">Sarah Jenkins (Nurse, Floor 2)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-purple-600 text-white font-semibold rounded-lg">Reschedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}