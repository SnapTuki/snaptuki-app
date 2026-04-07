import React, { useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { useFormik } from 'formik';
import { 
  User, Pill, Phone, History, Save, Trash2, CheckCircle, 
  ChevronLeft, Calendar, Bed, Stethoscope, Activity, 
  Clock, ShieldAlert, Loader2, Edit3, ClipboardList, AlertTriangle
} from 'lucide-react';

import { GET_RESIDENT_BY_ID } from '../../../features/residents/graphql/queries';

const SECTIONS = [
  { id: 'identity', label: 'Identity', icon: User },
  { id: 'clinical', label: 'Clinical Info', icon: Stethoscope },
  { id: 'care-plan', label: 'Care Plan', icon: ClipboardList },
  { id: 'history', label: 'Care History', icon: History },
];

import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';

export default function ResidentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('identity');

  const { data, loading, error, refetch } = useQuery(GET_RESIDENT_BY_ID, {
    variables: { residentId: id },
  });

  const resident = data?.getResidentById;
  console.log('Error ' + error?.message);
  const formik = useFormik({
    initialValues: {
      firstName: resident?.firstName || '',
      lastName: resident?.lastName || '',
      room: resident?.room || '',
      mobilityLevel: resident?.mobilityLevel || 'ASSISTED',
      status: resident?.status || 'ACTIVE',
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      // Trigger your UPDATE_RESIDENT mutation here
      console.log("Saving...", values);
    },
  });

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
    </div>
  );

  // 3. Critical Error State (e.g., Network down or ID not found)
  if (error && !data) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10 text-rose-600" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Data Retrieval Failed</h1>
        <p className="text-slate-500 max-w-md mb-8">
          {error.message.includes('Invalid phone number') 
            ? "A data validation error occurred. The resident's phone number format is currently incompatible with our domain rules." 
            : error.message}
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/dashboard/residents')}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
          >
            Back to Directory
          </button>
          <button 
            onClick={() => refetch()}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/residents')} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-none">
              {resident?.firstName} {resident?.lastName}
            </h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              MRN: {resident?.mrn} • Room {resident?.room || 'N/A'}
            </p>
          </div>
        </div>
      
      </header>

      {/* STICKY NAV */}
      <nav className="bg-white border-b border-slate-200 px-10 flex gap-8 shrink-0 z-20">
        {SECTIONS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(tab.id)}
            className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto p-10 space-y-16 pb-40">
        <div className="max-w-5xl mx-auto space-y-20">
          
          {/* SECTION: IDENTITY */}
          <section id="identity" className="scroll-mt-28">
            <SectionHeader title="Personal Identity" icon={<User />} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <EditableField label="First Name" name="firstName" formik={formik} />
               <EditableField label="Last Name" name="lastName" formik={formik} />
               <EditableField label="Gender" name="gender" type="select" options={['MALE', 'FEMALE', 'OTHER']} formik={formik} />
            </div>
          </section>

          {/* SECTION: CLINICAL (Allergies & Meds) */}
          <section id="clinical" className="scroll-mt-28">
            <SectionHeader title="Clinical Profile" icon={<Stethoscope />} />
            <div className="space-y-8">
              {/* Allergies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-black text-rose-500 uppercase tracking-tighter mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Allergies ({resident?.allergies?.length || 0})
                  </h3>
                  <div className="space-y-3">
                    {resident?.allergies?.map((a: any) => (
                      <div key={a.id} className="flex justify-between items-center p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                        <span className="font-bold text-slate-700">{a.name}</span>
                        <span className="text-[10px] font-black uppercase px-2 py-1 bg-rose-100 text-rose-600 rounded-lg">{a.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-black text-blue-500 uppercase tracking-tighter mb-4 flex items-center gap-2">
                    <Pill className="w-4 h-4" /> Current Medications
                  </h3>
                  <div className="space-y-3">
                    {resident?.medications?.map((m: any) => (
                      <div key={m.id} className="p-3 bg-blue-50/30 rounded-xl border border-blue-100/50">
                        <p className="font-bold text-slate-700">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.dosage} • {m.frequency}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: CARE PLAN (Assignments) */}
          <section id="care-plan" className="scroll-mt-28">
            <SectionHeader title="Care Plan Assignments" icon={<ClipboardList />} />
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Template Name</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {resident?.taskAssignments?.map((assign: any) => (
                    <tr key={assign.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700">{assign.taskTemplate.name}</td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">{assign.taskTemplate.category}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${assign.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          {assign.isActive ? 'Active' : 'Paused'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION: CARE HISTORY (Unified Tasks) */}
          <section id="history" className="scroll-mt-28">
            <SectionHeader title="Care History Timeline" icon={<History />} />
            <div className="relative border-l-2 border-slate-100 ml-4 space-y-8">
              {resident?.tasks?.map((task: any) => (
                <div key={task.id} className="relative pl-8">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ${
                    task.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-blue-400'
                  }`} />
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800">{task.category}: {task.status}</h4>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                        <Clock className="w-3 h-3" /> {new Date(task.dueAt).toLocaleDateString()}
                      </span>
                    </div>
                    {task.actionRecords?.[0] && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl text-sm text-slate-600 border border-slate-100">
                         <strong>Observation:</strong> {JSON.stringify(task.actionRecords[0].value)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* FLOATING ACTION BAR */}
      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-50">
        <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-[24px] p-4 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Discharge
            </button>
          </div>

          <div className="flex items-center gap-4">
            {formik.dirty && <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest animate-pulse">Changes Pending</span>}
            <button
              onClick={() => formik.handleSubmit()}
              disabled={!formik.dirty}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2 ${
                formik.dirty ? 'bg-blue-600 text-white hover:bg-blue-700 scale-105' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" /> Save Content
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatusBadge({ status }: { status: string }) {
  const active = status === 'ACTIVE';
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
      active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
    }`}>
      ● {status}
    </span>
  );
}

function SectionHeader({ title, icon }: { title: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
        {icon}
      </div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
    </div>
  );
}

function EditableField({ label, name, formik, type = 'text', options = [] }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const value = formik.values[name];

  return (
    <div 
      className={`group p-4 rounded-[20px] border transition-all cursor-pointer ${
        isEditing ? 'bg-white border-blue-500 shadow-lg scale-[1.02]' : 'bg-white/50 border-slate-100 hover:border-slate-200'
      }`}
      onClick={() => setIsEditing(true)}
    >
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
      {isEditing ? (
        <input
          {...formik.getFieldProps(name)}
          autoFocus 
          onBlur={() => setIsEditing(false)}
          className="w-full bg-transparent font-bold text-slate-900 outline-none"
        />
      ) : (
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700">{value || 'Not Set'}</span>
          <Edit3 className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </div>
  );
}