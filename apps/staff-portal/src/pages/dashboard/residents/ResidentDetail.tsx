import React, { useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { useFormik } from 'formik';
import {
  Info, Pill, Phone, History, Save, Trash2, CheckCircle,
  ChevronLeft, Calendar, Bed, Stethoscope, Activity,
  Clock, ShieldAlert, Loader2, Edit3, ClipboardList, AlertTriangle
} from 'lucide-react';
import ResidentOverview from '../../../features/residents/components/ResidentOverview';
import MedicationManager from '../../../features/residents/components/MedicationManager';
import TaskIncidentView from '../../../features/residents/components/TaskIncidentView';
import { GET_RESIDENT_BY_ID } from '../../../features/residents/graphql/queries';
import type { ResidentType } from '../../../lib/graphql/generated';


import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';

export default function ResidentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('identity');

  const { data, loading, error, refetch } = useQuery(GET_RESIDENT_BY_ID, {
    variables: { residentId: id },
  });

  const TABS = [
    { id: 'overview', label: 'Overview', icon: <Info className="w-3.5 h-3.5" /> },
    { id: 'actions', label: 'Tasks & Incidents', icon: <Activity className="w-3.5 h-3.5" /> },
  ];


  const resident = data?.getResidentById;
  console.log('Error ' + error?.message);

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
    <div className="flex flex-col  bg-[#F8FAFC] overflow-hidden">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex-1 items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-10">
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

         <div className="flex-1 flex justify-center">
              <nav className="flex bg-slate-800 p-1 rounded-xl gap-1 animate-in zoom-in-95 duration-300">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-1.5 px-4 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-100 shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </nav>
          </div>
      </header>

        {/* CONTENT */}
      <div className="flex-1 overflow-y-auto">
        
          <main className="max-w-400 mx-auto py-6">
            {activeTab === 'overview' &&(
              <ResidentOverview 
              residentId={id ? id : ''} />
            )}
            {activeTab === 'actions' && <TaskIncidentView residentId={id ? id : ''}/>}
            {activeTab === 'medication' && <MedicationManager />}
          </main>
      </div>

    </div>
  );
}
