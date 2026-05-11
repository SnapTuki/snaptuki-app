
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  Search,
  Plus,
  Bed,
  Activity,
  X,
  User,
  Stethoscope,
  Info,
} from "lucide-react";

import ResidentOverview from '../../../features/residents/components/ResidentOverview';
import MedicationManager from '../../../features/residents/components/MedicationManager';
import TaskIncidentView from '../../../features/residents/components/TaskIncidentView';
import { GET_RESIDENTS } from '../../../features/residents/graphql/queries';
import type { ResidentType } from '../../../lib/graphql/generated';

export function Residents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ✅ CHANGED: store only ID instead of full object
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState('overview');
  const searchRef = useRef<HTMLDivElement>(null);

  const { data, error, loading } = useQuery(GET_RESIDENTS);
  const residents: ResidentType[] = data?.residentList || [];

  console.log(error);

  // ✅ NEW: derive selected resident from Apollo data
  const selectedResident = useMemo(() => {
    return residents.find(r => r.residentId === selectedResidentId) || null;
  }, [selectedResidentId, residents]);

  const suggestions = useMemo(() => {
    if (!searchTerm) return [];
    return residents.filter(r =>
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.mrn.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 6);
  }, [searchTerm, residents]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const TABS = [
    { id: 'overview', label: 'Overview', icon: <Info className="w-3.5 h-3.5" /> },
    { id: 'actions', label: 'Tasks & Incidents', icon: <Activity className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] overflow-hidden ">

      {/* HEADER */}
      <header className="shrink-0 text-black z-50 p-2">
        <div className="px-6 py-3 flex items-center justify-between gap-6 max-w-400 mx-auto">

          {/* LEFT */}
          <div className="flex items-center gap-4 shrink-0 min-w-60">
            {!selectedResident ? (
              <h1 className="text-lg font-black tracking-tight text-black">Resident Directory</h1>
            ) : (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-sm shadow-inner">
                  {selectedResident.firstName[0]}{selectedResident.lastName[0]}
                </div>
                <div>
                  <h2 className="text-sm font-black leading-none">
                    {selectedResident.firstName} {selectedResident.lastName}
                  </h2>
                  <div className="flex gap-2 text-[10px] font-bold text-slate-400 uppercase mt-1">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3 h-3 text-emerald-500" /> {selectedResident.room}
                    </span>
                    <span className="flex items-center gap-1">
                      <Stethoscope className="w-3 h-3 text-blue-500" /> {selectedResident.mrn}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CENTER TABS */}
          <div className="flex-1 flex justify-center">
            {selectedResident && (
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
            )}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 shrink-0" ref={searchRef}>
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search MRN or Name..."
                className="w-48 lg:w-64 pl-9 pr-4 py-2 bg-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border overflow-hidden z-50">
                  {suggestions.map(r => (
                    <button
                      key={r.residentId}
                      onClick={() => {
                        // ✅ CHANGED
                        setSelectedResidentId(r.residentId);
                        setShowSuggestions(false);
                        setSearchTerm('');
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs">
                        {r.firstName[0]}{r.lastName[0]}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-xs">
                          {r.firstName} {r.lastName}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase">
                          MRN: {r.mrn}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedResident && (
              <button
                onClick={() => setSelectedResidentId(null)} // ✅ CHANGED
                className="p-2 text-slate-500 hover:text-rose-400"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <button className="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">
              <Plus className="w-3.5 h-3.5" /> Admit
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto">
        {!selectedResident ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-200">
            <User className="w-20 h-20 mb-4 opacity-5" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
              Select Resident Profile
            </p>
          </div>
        ) : (
          <main className="max-w-[1600px] mx-auto py-6">
            {activeTab === 'overview' && (
              <ResidentOverview 
              key={selectedResidentId}
              residentId={selectedResidentId} />
            )}
            {activeTab === 'actions' && <TaskIncidentView residentId={selectedResidentId}/>}
            {activeTab === 'medication' && <MedicationManager />}
          </main>
        )}
      </div>
    </div>
  );
}

export default Residents;

