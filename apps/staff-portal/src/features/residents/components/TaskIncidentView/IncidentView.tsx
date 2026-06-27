import { useState } from 'react';
import { 
  ShieldAlert, Calendar, X, MapPin, 
   AlertCircle, FileText, CheckCircle, 
  Send, Save
} from 'lucide-react';

// --- TYPES ---
interface Incident {
  id: string;
  title: string;
  type: string;
  severity: 'Minor' | 'Medium' | 'Critical';
  reporter: string;
  date: string;
  time: string;
  location: string;
  description: string;
  requiresAction: boolean;
  status: string;
}

const IncidentView = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isReporting, setIsReporting] = useState(false);

  const incidents: Incident[] = [
    { 
      id: 'INC-7721', 
      title: 'Unwitnessed fall in dining area', 
      type: 'Fall', 
      severity: 'Critical', 
      reporter: 'Nurse Sarah Jenkins', 
      date: '2026-04-20', 
      time: '12:45 PM', 
      location: 'Main Dining Hall - East Wing',
      description: 'Resident was found on the floor near table 4. Resident was conscious but disoriented. Vital signs taken immediately.',
      requiresAction: true,
      status: 'Under Review'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-transparent animate-in fade-in duration-500 overflow-hidden">
      
      {/* HEADER */}
      <header className="shrink-0 px-10 py-6 border-b border-slate-900/10 sticky top-0 z-20 backdrop-blur-xl bg-white/5">
        <div className="flex items-center justify-between gap-12 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-8 flex-1">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Range</span>
              <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-xl">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input type="date" className="bg-transparent text-xs font-bold text-slate-900 outline-none" defaultValue="2026-04-01" />
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsReporting(true)}
            className="flex items-center gap-3 px-8 py-4 bg-rose-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-200/40"
          >
            <ShieldAlert className="w-4 h-4" /> <span>Report Incident</span>
          </button>
        </div>
      </header>

      {/* LEDGER LIST */}
      <div className="flex-1 overflow-y-auto px-10 py-10">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center px-10 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] border-b-2 border-slate-900/5 mb-4 text-right">
            <div className="w-40 text-left">Timeline</div>
            <div className="w-48 text-left">Classification</div>
            <div className="flex-1 text-left">Subject Narrative</div>
            <div className="w-40">Reference</div>
          </div>

          <div className="space-y-px bg-slate-200 shadow-inner rounded-2xl overflow-hidden border border-slate-200">
            {incidents.map((incident) => (
              <div 
                key={incident.id}
                onClick={() => setSelectedIncident(incident)}
                className={`group flex items-center px-10 py-8 bg-white hover:bg-slate-50 transition-all cursor-pointer border-l-[6px] ${incident.severity === 'Critical' ? 'border-rose-600' : 'border-slate-300'}`}
              >
                <div className="w-40 shrink-0 text-sm font-black text-slate-900">{incident.date}</div>
                <div className="w-48 shrink-0">
                    <span className="text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-[0.15em] border bg-slate-50 border-slate-200 text-slate-600">
                        {incident.type}
                    </span>
                </div>
                <div className="flex-1 pr-12 font-black text-xl tracking-tight">{incident.title}</div>
                <div className="w-40 text-right text-xs font-bold text-slate-400">{incident.id}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          REPORTING FORM MODAL (Full Detailed)
          ========================================= */}
      {isReporting && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Form Header */}
            <div className="px-10 py-10 bg-rose-600 text-white flex justify-between items-start shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-5 h-5 text-rose-200" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-100">Clinical Intake Form</span>
                </div>
                <h2 className="text-3xl font-black tracking-tight leading-none">Report New Incident</h2>
              </div>
              <button onClick={() => setIsReporting(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              
              {/* Section 01: Identification */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] border-b border-slate-100 pb-2">01. Identity & Classification</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Incident Title</label>
                    <input type="text" placeholder="e.g. Unwitnessed Fall in Hallway" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-base font-bold outline-none focus:ring-2 focus:ring-rose-500/20" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Incident Type</label>
                    <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-base font-bold outline-none appearance-none">
                      <option>Select Type...</option>
                      <option>Fall</option>
                      <option>Medication Error</option>
                      <option>Behavioral</option>
                      <option>Injury</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 02: Logistics */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] border-b border-slate-100 pb-2">02. Logistics & Severity</h4>
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-center block">Date</label>
                    <input type="date" className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-center block">Time</label>
                    <input type="time" className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-center block">Severity</label>
                    <select className="w-full px-4 py-4 bg-rose-50 text-rose-600 border-none rounded-2xl text-sm font-black outline-none appearance-none text-center">
                      <option>Minor</option>
                      <option>Medium</option>
                      <option>Critical</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Specific Location</label>
                   <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="e.g. Dining Hall, West Wing Corridor" className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-base font-bold outline-none focus:ring-2 focus:ring-rose-500/20" />
                   </div>
                </div>
              </div>

              {/* Section 03: Narrative */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] border-b border-slate-100 pb-2">03. Narrative Description</h4>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">What happened? (Clinical Narrative)</label>
                  <textarea rows={5} placeholder="Describe the incident in detail, including resident's state and immediate actions taken..." className="w-full px-6 py-5 bg-slate-50 border-none rounded-[32px] text-base font-medium leading-relaxed outline-none focus:ring-2 focus:ring-rose-500/20 resize-none" />
                </div>
              </div>

              {/* Section 04: Action Required */}
              <div className="flex items-center justify-between p-8 bg-slate-900 rounded-[32px] text-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-tight">Requires Immediate Clinical Action?</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Check if a doctor or manager needs to follow up</p>
                  </div>
                </div>
                <input type="checkbox" className="w-8 h-8 rounded-xl bg-white/10 border-none outline-none accent-rose-500 cursor-pointer" />
              </div>

            </div>

            {/* Form Footer */}
            <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
               <button onClick={() => setIsReporting(false)} className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">
                 Discard Draft
               </button>
               <div className="flex gap-4">
                 <button className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">
                   <Save className="w-4 h-4" /> Save as Draft
                 </button>
                 <button className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                   <Send className="w-4 h-4" /> Submit Report
                 </button>
               </div>
            </div>

          </div>
        </div>
      )}

      {/* INCIDENT DETAIL MODAL (Existing logic) */}
      {selectedIncident && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 scale-100">
            
            <div className={`px-10 py-12 flex justify-between items-start border-b ${selectedIncident.severity === 'Critical' ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Immutable Log: {selectedIncident.id}</span>
                <h2 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">{selectedIncident.title}</h2>
              </div>
              <button onClick={() => setSelectedIncident(null)} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-rose-600 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-6 bg-white"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Reporter</p><p className="text-sm font-bold">{selectedIncident.reporter}</p></div>
                <div className="p-6 bg-white"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Timestamp</p><p className="text-sm font-bold">{selectedIncident.date} @ {selectedIncident.time}</p></div>
                <div className="p-6 bg-white"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Location</p><p className="text-sm font-bold">{selectedIncident.location}</p></div>
                <div className="p-6 bg-white"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Severity</p><p className={`text-sm font-black uppercase ${selectedIncident.severity === 'Critical' ? 'text-rose-600' : 'text-slate-800'}`}>{selectedIncident.severity}</p></div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FileText className="w-4 h-4" /> Personnel Narrative</p>
                <div className="p-8 bg-slate-50 rounded-[32px] border-l-4 border-slate-900">
                  <p className="text-lg font-medium text-slate-700 leading-relaxed italic">"{selectedIncident.description}"</p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className={`flex items-center gap-4 p-6 rounded-2xl border ${selectedIncident.requiresAction ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                {selectedIncident.requiresAction ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Resolution Status</p>
                  <p className="text-sm font-bold">{selectedIncident.requiresAction ? 'Critical Action Required' : 'Incident Log Closed'}</p>
                </div>
              </div>
            </div>

            <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedIncident(null)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Close Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentView;