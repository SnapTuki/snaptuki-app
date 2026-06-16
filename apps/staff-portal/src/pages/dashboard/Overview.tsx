import React, { useState, useMemo } from 'react';
import { 
  X,
  Loader2,
  ShieldAlert,
  Search,
  Filter,
  ArrowLeft,
  Edit2,
  Flag,
  Trash2,
  MailOpen,
  Download,
  Share,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Reply,
  Forward,
  Check,
  RotateCcw,
  UserPlus
} from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql, type TypedDocumentNode } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// --- TYPESCRIPT INTERFACES ---
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
  type: string;
  severity: string;
  reportedAt: string;
  description: string;
  status: string;
  resident: { firstName: string; lastName: string; room: string };
  reportedBy: { firstName: string; lastName: string };
}

interface TriageDashboardData {
  overdueTasks: TriageTask[];
  cancelledTasks: TriageTask[];
}

interface UnifiedMessage {
  id: string;
  type: 'INCIDENT' | 'OVERDUE' | 'REVIEW';
  senderName: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  isNew: boolean;
  raw: any;
}

// --- GRAPHQL OPERATIONS ---
const GET_TRIAGE_DASHBOARD: TypedDocumentNode<TriageDashboardData> = gql`
  query GetTriageDashboard {
    overdueTasks: taskList(status: "MISSED") {
      id title priority dueAt
      assignedResident { firstName lastName }
      assignedCaregiver { firstName lastName }
    }
    cancelledTasks: taskList(status: "CANCELLED") {
      id title priority dueAt category completionNotes
      assignedResident { firstName lastName }
      assignedCaregiver { firstName lastName }
    }
  }
`;

const CANCEL_TASK_MUTATION = gql`
  mutation CancelTask($id: String!, $reason: String!) {
    cancelTask(id: $id, reason: $reason) { id status }
  }
`;

// --- MAIN PAGE COMPONENT ---
export const Overview = () => {
  // UI State
  const [activeTab, setActiveTab] = useState<'Primary' | 'Alerts' | 'Tasks'>('Primary');
  const [activeModal, setActiveModal] = useState<'CANCEL' | 'REVIEW_INCIDENT' | 'RESCHEDULE' | 'REASSIGN' | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  // Queries & Mutations
  const { data, loading, error, refetch } = useQuery(GET_TRIAGE_DASHBOARD, {
    fetchPolicy: 'cache-and-network',
  });
  const [cancelTask] = useMutation(CANCEL_TASK_MUTATION);

  // MOCK DATA (Incidents)
  const mockIncidents: Incident[] = [
    {
      id: 'inc_101',
      type: 'FALL',
      severity: 'CRITICAL',
      reportedAt: new Date(Date.now() - 15 * 60000).toISOString(), 
      description: 'Found on floor next to bed. Conscious but complaining of hip pain. Vitals stable. Awaiting physician review.',
      status: 'UNRESOLVED',
      resident: { firstName: 'Elsa', lastName: 'Niemi', room: '204B' },
      reportedBy: { firstName: 'Sarah', lastName: 'Jenkins' }
    },
    {
      id: 'inc_102',
      type: 'BEHAVIORAL',
      severity: 'HIGH',
      reportedAt: new Date(Date.now() - 120 * 60000).toISOString(), 
      description: 'Severe agitation during lunch. Threw tray, refused redirection from staff.',
      status: 'UNDER_REVIEW',
      resident: { firstName: 'Lars', lastName: 'Olsen', room: '110A' },
      reportedBy: { firstName: 'Mikko', lastName: 'Lehtonen' }
    }
  ];

  // Map Data to Unified Message Format
  const messages: UnifiedMessage[] = useMemo(() => {
    const list: UnifiedMessage[] = [];
    
    // Map Incidents
    mockIncidents.forEach(inc => {
      list.push({
        id: inc.id,
        type: 'INCIDENT',
        senderName: `${inc.reportedBy.firstName} ${inc.reportedBy.lastName}`,
        senderEmail: `${inc.reportedBy.firstName.toLowerCase()}@snaptuki.care`,
        subject: `Critical Alert: ${inc.type.replace('_', ' ')}`,
        snippet: `Resident ${inc.resident.firstName} involved in incident. Room ${inc.resident.room}.`,
        body: `Dear Triage Admin,\n\nPlease review the following incident report:\n\nResident: ${inc.resident.firstName} ${inc.resident.lastName}\nLocation: Room ${inc.resident.room}\nSeverity: ${inc.severity}\n\nDescription:\n${inc.description}\n\nPlease ensure that the resident is securely monitored and forward to the attending physician if required.\n\nWarm regards,\n${inc.reportedBy.firstName} ${inc.reportedBy.lastName}`,
        date: inc.reportedAt,
        isNew: true,
        raw: inc
      });
    });

    // Map Overdue
    data?.overdueTasks?.forEach(task => {
      list.push({
        id: task.id,
        type: 'OVERDUE',
        senderName: 'System Scheduler',
        senderEmail: 'noreply@snaptuki.care',
        subject: `Overdue Task: ${task.title}`,
        snippet: `Task assigned to ${task.assignedCaregiver?.firstName || 'unassigned'} is overdue.`,
        body: `Hello,\n\nThe following clinical task has missed its scheduled delivery window and requires immediate action.\n\nTask: ${task.title}\nResident: ${task.resident?.firstName || 'N/A'}\nAssigned to: ${task.assignedCaregiver?.firstName || 'Unassigned'}\n\nPlease reassign this task to an available caregiver or dismiss it if no longer relevant.\n\nRegards,\nSystem Administrator`,
        date: task.dueAt,
        isNew: false,
        raw: task
      });
    });

    // Map Cancelled/Review
    data?.cancelledTasks?.forEach(task => {
      const sender = task.assignedCaregiver ? `${task.assignedCaregiver.firstName} ${task.assignedCaregiver.lastName}` : 'System';
      list.push({
        id: task.id,
        type: 'REVIEW',
        senderName: sender,
        senderEmail: `${sender.split(' ')[0]?.toLowerCase() || 'sys'}@snaptuki.care`,
        subject: `Task Dismissed: ${task.title}`,
        snippet: task.completionNotes?.[0] || 'Caregiver cancelled this action.',
        body: `Hi Admin,\n\nI needed to cancel the scheduled action for the resident. \n\nTask: ${task.title}\nReason provided:\n"${task.completionNotes?.[0] || 'No reason provided.'}"\n\nPlease advise if this needs to be rescheduled or completely removed from the care plan.\n\nThanks,\n${sender}`,
        date: task.dueAt,
        isNew: true,
        raw: task
      });
    });

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data]);

  const filteredMessages = messages.filter(msg => {
    if (activeTab === 'Primary') return true;
    if (activeTab === 'Alerts') return msg.type === 'INCIDENT';
    if (activeTab === 'Tasks') return msg.type === 'OVERDUE' || msg.type === 'REVIEW';
    return true;
  });

  const selectedMessage = messages.find(m => m.id === selectedMessageId) || null;

  // Formatting Helpers
  const formatListDate = (isoString: string) => {
    const date = new Date(isoString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const formatDetailDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' • ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAvatarInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
  };

  // Modals Actions
  const handleActionClick = (action: 'CANCEL' | 'REVIEW_INCIDENT' | 'RESCHEDULE' | 'REASSIGN') => {
    if (selectedMessage) setActiveModal(action);
  };

  // Forms
  const cancelFormik = useFormik({
    initialValues: { reason: '' },
    validationSchema: Yup.object({ reason: Yup.string().required('Required') }),
    onSubmit: async (values, { resetForm }) => {
      if(selectedMessage) {
        await cancelTask({ variables: { id: selectedMessage.raw.id, reason: values.reason } });
        await refetch();
        setActiveModal(null);
        setSelectedMessageId(null);
        resetForm();
      }
    },
  });

  const incidentFormik = useFormik({
    initialValues: { actionTaken: '' },
    validationSchema: Yup.object({ actionTaken: Yup.string().required('Required') }),
    onSubmit: async (values, { resetForm }) => {
      console.log(`Incident resolved: ${values.actionTaken}`);
      setActiveModal(null);
      setSelectedMessageId(null);
      resetForm();
    },
  });

  if (error) return <div className="p-8 text-center text-red-600">Failed to load data.</div>;

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden text-slate-800">
      
      {/* =========================================
          LEFT PANE (Inbox List)
          ========================================= */}
      <div className="w-[320px] lg:w-[380px] border-r border-slate-200 flex flex-col h-full bg-white shrink-0">
        
        {/* Mail Header */}
        <div className="px-6 py-5 flex items-center justify-between">
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Inbox</h1>
          <button className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors text-slate-600">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Tabs */}
        <div className="px-4 mb-2">
          <div className="flex bg-slate-100 p-1 rounded-full">
            {(['Primary', 'Alerts', 'Tasks'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-[13px] font-semibold rounded-full transition-all ${
                  activeTab === tab ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto mt-2">
          {loading ? (
             <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></div>
          ) : filteredMessages.length === 0 ? (
             <div className="p-8 text-center text-sm text-slate-400">No messages in {activeTab}.</div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = selectedMessageId === msg.id;
              return (
                <div 
                  key={msg.id}
                  onClick={() => setSelectedMessageId(msg.id)}
                  className={`px-6 py-4 border-b border-slate-100 cursor-pointer transition-colors relative ${
                    isSelected ? 'bg-slate-50' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${msg.type === 'INCIDENT' ? 'bg-rose-500' : msg.type === 'OVERDUE' ? 'bg-orange-500' : 'bg-purple-500'}`}>
                          {getAvatarInitials(msg.senderName)}
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>
                      <span className={`text-[15px] text-slate-900 truncate max-w-[150px] ${msg.isNew ? 'font-bold' : 'font-semibold'}`}>
                        {msg.senderName}
                      </span>
                    </div>
                    <span className={`text-xs ${msg.isNew ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                      {formatListDate(msg.date)}
                    </span>
                  </div>
                  
                  <div className="pl-12">
                    <div className="flex items-start justify-between gap-2">
                       <div className="min-w-0">
                         <div className={`text-sm truncate mb-0.5 ${msg.isNew ? 'font-bold text-slate-800' : 'font-medium text-slate-700'}`}>
                           {msg.subject}
                         </div>
                         <div className="text-[13px] text-slate-500 truncate line-clamp-1 leading-snug">
                           {msg.snippet}
                         </div>
                       </div>
                       {msg.isNew && (
                         <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-1">
                           New
                         </span>
                       )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* =========================================
          RIGHT PANE (Detail View)
          ========================================= */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        {selectedMessage ? (
          <>
            {/* Top Toolbar */}
            <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-6 text-slate-500">
                <button onClick={() => setSelectedMessageId(null)} className="hover:text-slate-800 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                <div className="w-px h-5 bg-slate-200" />
                <button className="hover:text-slate-800 transition-colors"><Edit2 className="w-[18px] h-[18px]" /></button>
                <button className="hover:text-amber-500 transition-colors"><Flag className="w-[18px] h-[18px]" /></button>
                <button className="hover:text-rose-600 transition-colors"><Trash2 className="w-[18px] h-[18px]" /></button>
                <div className="w-px h-5 bg-slate-200" />
                <button className="hover:text-slate-800 transition-colors"><MailOpen className="w-[18px] h-[18px]" /></button>
                <button className="hover:text-slate-800 transition-colors"><Download className="w-[18px] h-[18px]" /></button>
                <button className="hover:text-slate-800 transition-colors"><Share className="w-[18px] h-[18px]" /></button>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="font-medium">
                  {filteredMessages.findIndex(m => m.id === selectedMessage.id) + 1} of {filteredMessages.length}
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-slate-100 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                  <button className="p-1 hover:bg-slate-100 rounded-full"><ChevronRight className="w-5 h-5" /></button>
                </div>
                <button className="p-1 hover:bg-slate-100 rounded-full"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Message Content Area */}
            <div className="flex-1 overflow-y-auto px-10 lg:px-16 py-10">
              
              {/* Header Info */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-sm ${selectedMessage.type === 'INCIDENT' ? 'bg-rose-500' : selectedMessage.type === 'OVERDUE' ? 'bg-orange-500' : 'bg-purple-500'}`}>
                    {getAvatarInitials(selectedMessage.senderName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-slate-900 text-[15px]">{selectedMessage.senderName}</h3>
                      <span className="text-xs text-slate-400 font-medium">&lt;{selectedMessage.senderEmail}&gt;</span>
                    </div>
                    <p className="text-[13px] text-slate-500">to Triage Admin</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-slate-500 pt-1">
                  {formatDetailDate(selectedMessage.date)}
                </div>
              </div>

              {/* Subject */}
              <h2 className="text-[26px] font-normal text-slate-900 mb-8 leading-tight">
                {selectedMessage.subject}
              </h2>

              {/* Body */}
              <div className="text-[15px] text-slate-800 whitespace-pre-wrap leading-relaxed mb-12 max-w-4xl">
                {selectedMessage.body}
              </div>

              {/* Action Buttons mimicking Reply/Forward */}
              <div className="flex gap-4 border-t border-slate-100 pt-8 mt-auto">
                {selectedMessage.type === 'INCIDENT' && (
                  <button onClick={() => handleActionClick('REVIEW_INCIDENT')} className="px-5 py-2 border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                    <Reply className="w-4 h-4" /> Resolve Incident
                  </button>
                )}
                
                {selectedMessage.type === 'OVERDUE' && (
                  <>
                    <button onClick={() => handleActionClick('REASSIGN')} className="px-5 py-2 border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                      <UserPlus className="w-4 h-4" /> Reassign Task
                    </button>
                    <button onClick={() => handleActionClick('CANCEL')} className="px-5 py-2 border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                      <X className="w-4 h-4" /> Dismiss
                    </button>
                  </>
                )}

                {selectedMessage.type === 'REVIEW' && (
                  <>
                    <button className="px-5 py-2 border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                      <Check className="w-4 h-4" /> Acknowledge
                    </button>
                    <button onClick={() => handleActionClick('RESCHEDULE')} className="px-5 py-2 border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                      <RotateCcw className="w-4 h-4" /> Reschedule
                    </button>
                  </>
                )}

                {/* Generic Forward */}
                <button className="px-5 py-2 border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                  <Forward className="w-4 h-4" /> Forward
                </button>
              </div>

            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50">
            <MailOpen className="w-16 h-16 text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">Select an item to read</p>
          </div>
        )}
      </div>

      {/* --- FORMIK MODALS --- */}
      {/* Incident Review Modal */}
      {activeModal === 'REVIEW_INCIDENT' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600"><ShieldAlert className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Resolve Incident</h3>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={incidentFormik.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Action Taken & Notes</label>
                <textarea 
                  name="actionTaken"
                  rows={4}
                  className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 border-slate-200 bg-slate-50 focus:border-rose-300 focus:ring-rose-500/10 text-sm"
                  placeholder="E.g., Resident assessed by RN, family notified..."
                  value={incidentFormik.values.actionTaken}
                  onChange={incidentFormik.handleChange}
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-rose-600 text-white font-semibold text-sm rounded-xl hover:bg-rose-700 transition-colors shadow-sm">Mark as Resolved</button>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Task Modal */}
      {activeModal === 'CANCEL' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-lg font-bold text-slate-900">Dismiss Action</h3>
               <button onClick={() => setActiveModal(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X className="w-4 h-4"/></button>
            </div>
            <p className="text-sm text-slate-500 mb-5">You are about to dismiss the selected action.</p>
            
            <form onSubmit={cancelFormik.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Dismissal Reason</label>
                <textarea 
                  name="reason"
                  rows={3}
                  className="w-full px-4 py-3 border rounded-xl border-slate-200 bg-slate-50 focus:border-red-300 focus:ring-red-500/10 outline-none text-sm transition-all"
                  value={cancelFormik.values.reason}
                  onChange={cancelFormik.handleChange}
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-red-700 transition-colors">Confirm Dismissal</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};