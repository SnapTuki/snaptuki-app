import React, { useState } from 'react';
import { 
  Pill, Clock, AlertCircle, CheckCircle2, 
  ChevronRight, History, Info, ClipboardCheck, 
  Activity, Thermometer, FlaskConical, Search
} from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string; // e.g., Oral, Topical
  instructions: string;
  lastAdministered: string | null;
  status: 'DUE' | 'SCHEDULED' | 'PRN' | 'COMPLETED';
  type: 'ROUTINE' | 'PRN' | 'STAT';
}

const MedicationManager = () => {
  const [selectedMed, setSelectedMed] = useState<string | null>(null);
  
  // Mock Data for Health Staff
  const medications: Medication[] = [
    { id: '1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once Daily', route: 'Oral', instructions: 'Take with food', lastAdministered: 'Yesterday, 08:00', status: 'DUE', type: 'ROUTINE' },
    { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice Daily', route: 'Oral', instructions: 'Monitor glucose levels', lastAdministered: 'Today, 07:30', status: 'COMPLETED', type: 'ROUTINE' },
    { id: '3', name: 'Acetaminophen', dosage: '500mg', frequency: 'Every 6h PRN', route: 'Oral', instructions: 'For mild pain', lastAdministered: null, status: 'PRN', type: 'PRN' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-16 animate-in fade-in duration-700">
      
      {/* 01. ACTIVE MEDICATION QUEUE */}
      <section>
        <div className="px-6 mb-8 flex items-end justify-between">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
             <Pill className="w-4 h-4 text-blue-600" /> 01. Active Administration Queue
          </h3>
          <div className="h-px flex-1 bg-slate-200 ml-6 mb-1.5 opacity-50" />
        </div>

        <div className="space-y-1">
          {medications.map((med) => (
            <div 
              key={med.id}
              onClick={() => setSelectedMed(med.id)}
              className={`group flex items-center gap-8 px-8 py-8 transition-all duration-300 cursor-pointer border-l-4 ${
                selectedMed === med.id 
                  ? 'bg-slate-900 border-blue-500' 
                  : med.status === 'DUE' 
                    ? 'hover:bg-rose-50/50 border-rose-500 bg-transparent'
                    : 'hover:bg-slate-50 border-transparent bg-transparent'
              }`}
            >
              {/* Status Icon */}
              <div className="shrink-0">
                {med.status === 'COMPLETED' ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                ) : med.status === 'DUE' ? (
                  <Clock className="w-8 h-8 text-rose-500 animate-pulse" />
                ) : (
                  <Info className="w-8 h-8 text-slate-300" />
                )}
              </div>

              {/* Med Details */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedMed === med.id ? 'text-blue-400' : 'text-slate-400'}`}>Medication & Dose</p>
                  <p className={`text-xl font-bold ${selectedMed === med.id ? 'text-white' : 'text-slate-900'}`}>{med.name} <span className="text-sm font-medium opacity-60">{med.dosage}</span></p>
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedMed === med.id ? 'text-blue-400' : 'text-slate-400'}`}>Schedule / Route</p>
                  <p className={`text-lg font-bold ${selectedMed === med.id ? 'text-slate-300' : 'text-slate-700'}`}>{med.frequency} • {med.route}</p>
                </div>
                <div className="hidden lg:block">
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedMed === med.id ? 'text-blue-400' : 'text-slate-400'}`}>Last Given</p>
                  <p className={`text-sm font-bold ${selectedMed === med.id ? 'text-slate-400' : 'text-slate-500'}`}>{med.lastAdministered || 'Not recorded'}</p>
                </div>
              </div>

              {/* Action Side */}
              <div className="flex items-center gap-4">
                {selectedMed === med.id ? (
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20">
                    Record Pass
                  </button>
                ) : (
                  <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-slate-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 02. VITALS PRE-REQUISITES */}
      <section>
        <div className="px-6 mb-8 flex items-end justify-between">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
             <Activity className="w-4 h-4 text-emerald-600" /> 02. Required Pre-Administration Vitals
          </h3>
          <div className="h-px flex-1 bg-slate-200 ml-6 mb-1.5 opacity-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
           <div className="px-8 py-8 border-l-2 border-slate-200 hover:bg-slate-50 transition-colors">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Thermometer className="w-3.5 h-3.5" /> Temp</p>
              <input type="text" placeholder="--" className="text-2xl font-black text-slate-900 bg-transparent outline-none w-full placeholder:text-slate-200" />
           </div>
           <div className="px-8 py-8 border-l-2 border-slate-200 hover:bg-slate-50 transition-colors">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> BP</p>
              <input type="text" placeholder="---/--" className="text-2xl font-black text-slate-900 bg-transparent outline-none w-full placeholder:text-slate-200" />
           </div>
           <div className="px-8 py-8 border-l-2 border-slate-200 hover:bg-slate-50 transition-colors">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FlaskConical className="w-3.5 h-3.5" /> Blood Glucose</p>
              <input type="text" placeholder="mg/dL" className="text-2xl font-black text-slate-900 bg-transparent outline-none w-full placeholder:text-slate-200" />
           </div>
        </div>
      </section>

      {/* 03. CLINICAL NOTES & ALERTS */}
      <section>
        <div className="px-6 mb-8 flex items-end justify-between">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
             <AlertCircle className="w-4 h-4 text-rose-600" /> 03. Interaction Warnings & Notes
          </h3>
          <div className="h-px flex-1 bg-slate-200 ml-6 mb-1.5 opacity-50" />
        </div>
        
        <div className="px-8 py-8 border-l-2 border-rose-500 bg-rose-50/30">
          <p className="text-sm font-bold text-rose-900 leading-relaxed">
            High Alert: Resident has reported difficulty swallowing large tablets. Crush Lisinopril and mix with apple sauce if required. 
            Monitor for orthostatic hypotension after initial dose.
          </p>
        </div>
      </section>
    </div>
  );
};

export default MedicationManager;