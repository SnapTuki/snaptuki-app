import React, { useState, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom'; // <-- Added Link for navigation
import {
  Search,
  Filter,
  Plus,
  Bed,
  Activity,
  Calendar,
  X,
  User,
  FileText,
  Loader2,
  Save,
  AlertCircle,
  Stethoscope,
  ChevronDown,
  Users
} from "lucide-react";
import { GET_RESIDENTS } from '../../../features/residents/graphql/queries';
import { REGISTER_RESIDENT } from '../../../features/residents/graphql/mutations';
import type { ResidentType } from '../../../lib/graphql/generated';

const calculateAge = (dobString: string) => {
  if (!dobString) return 0;
  const birthday = new Date(dobString);
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const ResidentSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'Name too short').required('Required'),
  lastName: Yup.string().min(2, 'Name too short').required('Required'),
  mrn: Yup.string().required('Medical Record Number is required'),
  birthDate: Yup.string().required('Birth date is required'),
  gender: Yup.string().required('Required'),
  mobilityLevel: Yup.string().required('Required'),
  room: Yup.string().required('Room is required'),
});

// --- HELPER COMPONENT ---
function MobilityBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    'MEMORY': 'text-rose-700 bg-rose-50 border-rose-200 shadow-sm shadow-rose-100',
    'ASSISTED': 'text-blue-700 bg-blue-50 border-blue-200 shadow-sm shadow-blue-100',
    'INDEPENDENT': 'text-emerald-700 bg-emerald-50 border-emerald-200 shadow-sm shadow-emerald-100',
  };
  const config = styles[level] || styles['INDEPENDENT'];
  return (
    <span className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-widest border flex items-center gap-1.5 w-fit ${config}`}>
      <Activity className="w-3.5 h-3.5" /> {level.replace('_', ' ')}
    </span>
  );
}

// --- ADMISSION DRAWER ---
interface ResidentFormProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

function ResidentForm({ isOpen, onClose, refetch }: ResidentFormProps) {
  const [registerResident] = useMutation(REGISTER_RESIDENT);

  const formik = useFormik({
    initialValues: {
      mrn: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: 'UNSPECIFIED',
      mobilityLevel: 'ASSISTED',
      room: '',
    },
    enableReinitialize: true,
    validationSchema: ResidentSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setStatus }) => {
      try {
        await registerResident({
          variables: {
            input: {
              mrn: values.mrn,
              firstName: values.firstName,
              lastName: values.lastName,
              birthDate: new Date(values.birthDate).toISOString(),
              gender: values.gender,
              mobilityLevel: values.mobilityLevel,
              room: values.room,
            }
          }
        });
        refetch();
        resetForm();
        onClose();
      } catch (err: any) {
        setStatus(err.message || 'An error occurred while saving.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 border-l border-slate-100 flex flex-col">

        {/* Form Header */}
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Admit New Resident</h2>
            <p className="text-sm text-slate-500">Register a new individual</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {formik.status && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {formik.status}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">First Name</label>
                <input
                  {...formik.getFieldProps('firstName')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
                {formik.touched.firstName && formik.errors.firstName && <p className="text-xs text-rose-500 ml-1 font-bold">{formik.errors.firstName as string}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Last Name</label>
                <input
                  {...formik.getFieldProps('lastName')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
                {formik.touched.lastName && formik.errors.lastName && <p className="text-xs text-rose-500 ml-1 font-bold">{formik.errors.lastName as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Birth Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    {...formik.getFieldProps('birthDate')}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
                <select
                  {...formik.getFieldProps('gender')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none text-slate-700 font-medium"
                >
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                  <option value="OTHER">Other</option>
                  <option value="UNSPECIFIED">Unspecified</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-4" />

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4" /> Admission & Care
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">MRN</label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    {...formik.getFieldProps('mrn')}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all uppercase"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Room No.</label>
                <div className="relative">
                  <Bed className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    {...formik.getFieldProps('room')}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Care Level</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'INDEPENDENT', label: 'Indep', color: 'emerald' },
                  { id: 'ASSISTED', label: 'Assisted', color: 'blue' },
                  { id: 'MEMORY', label: 'Memory', color: 'rose' },
                ].map((level) => (
                  <label
                    key={level.id}
                    className={`
                      flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all
                      ${formik.values.mobilityLevel === level.id
                        ? `bg-${level.color}-50 border-${level.color}-500 text-${level.color}-700`
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}
                    `}
                  >
                    <input type="radio" name="mobilityLevel" value={level.id} onChange={formik.handleChange} className="hidden" />
                    <span className="text-xs font-bold uppercase tracking-wider">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Form Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button onClick={onClose} type="button" className="flex-1 py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
            Cancel
          </button>
          <button
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting}
            type="submit"
            className="flex-[2] py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {formik.isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            Admit Resident
          </button>
        </div>
      </div>
    </>
  );
}

export function Residents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mobilityFilter, setMobilityFilter] = useState('ALL');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_RESIDENTS, {
    variables: { search: searchTerm || undefined },
    fetchPolicy: 'cache-and-network'
  });

  const residents: ResidentType[] = data?.residentList || [];

  const filteredResidents = useMemo(() => {
    let filtered = residents;

    if (mobilityFilter !== 'ALL') {
      filtered = filtered.filter(r => r.mobilityLevel === mobilityFilter);
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.firstName.toLowerCase().includes(lowerTerm) ||
        r.lastName.toLowerCase().includes(lowerTerm) ||
        r.mrn.toLowerCase().includes(lowerTerm) ||
        (r.room && r.room.toLowerCase().includes(lowerTerm))
      );
    }

    return filtered;
  }, [residents, mobilityFilter, searchTerm]);

  const totalResidents = residents.length;
  const memoryCareCount = residents.filter(r => r.mobilityLevel === 'MEMORY').length;
  const assistedCount = residents.filter(r => r.mobilityLevel === 'ASSISTED').length;

  const handleCreate = () => {
    setIsDrawerOpen(true);
  };

  const clearFilters = () => {
    setMobilityFilter('ALL');
    setSearchTerm('');
  };

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

      <ResidentForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        refetch={refetch}
      />

      {/* =========================================
          FIXED HEADER AREA (Will never scroll)
          ========================================= */}
      <div className="shrink-0 flex flex-col gap-5 pb-4 pt-2 z-10 bg-slate-50/50 px-6 md:px-10">

        {/* Title & Primary Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Resident Directory</h1>
            <p className="text-slate-500 font-medium mt-1">Manage admissions, care levels, and lodging.</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            Admit Resident
          </button>
        </div>

        {/* Thin Boxed Stats */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2.5 px-4 py-2 border border-slate-200 bg-white/60 rounded-xl shadow-sm">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <span className="text-slate-500 font-medium">Total: <strong className="text-slate-900 ml-0.5">{totalResidents}</strong></span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 border border-slate-200 bg-white/60 rounded-xl shadow-sm">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-slate-500 font-medium">Assisted: <strong className="text-slate-900 ml-0.5">{assistedCount}</strong></span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 border border-slate-200 bg-white/60 rounded-xl shadow-sm">
            <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <span className="text-slate-500 font-medium">Memory: <strong className="text-slate-900 ml-0.5">{memoryCareCount}</strong></span>
          </div>
        </div>

        {/* Controls: Thin Boxed Search & Filter */}
        <div className="flex flex-col lg:flex-row items-center justify-end gap-4 mt-1">
          <div className="flex w-full lg:w-auto gap-3 items-center">
            <div className="relative group w-full lg:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search MRN, name, or room..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 focus:border-blue-300 shadow-sm rounded-xl outline-none text-slate-700 font-medium placeholder:text-slate-400 text-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && refetch()}
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border shadow-sm transition-colors ${isFilterOpen || mobilityFilter !== 'ALL'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
            >
              <Filter className="w-4 h-4" /> Filter
              {mobilityFilter !== 'ALL' && (
                <span className="w-2 h-2 rounded-full bg-blue-600 ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Inline Expandable Filter Panel */}
        {isFilterOpen && (
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-wrap gap-4 animate-in fade-in slide-in-from-top-2 duration-200 self-end">
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mobility Level</label>
              <div className="relative">
                <select
                  value={mobilityFilter}
                  onChange={(e) => setMobilityFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-blue-300 transition-colors appearance-none"
                >
                  <option value="ALL">All Levels</option>
                  <option value="INDEPENDENT">Independent</option>
                  <option value="ASSISTED">Assisted</option>
                  <option value="MEMORY">Memory</option>
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
          SCROLLABLE LIST AREA (Grid of Innovative Cards)
          ========================================= */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-10 px-6 md:px-10">
        {loading && !data ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-slate-300" />
            <p className="text-sm font-bold text-slate-500">Loading directory...</p>
          </div>
        ) : error ? (
          <div className="py-8 flex items-center justify-center text-red-600 bg-red-50 rounded-2xl border border-red-200 mt-2">
            <AlertCircle className="w-5 h-5 mr-3" />
            <p className="text-sm font-bold">Error: {error.message}</p>
          </div>
        ) : filteredResidents.length === 0 ? (
          <div className="text-center py-20 bg-white/50 border border-slate-200 rounded-3xl mt-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No records found</h3>
            <p className="text-sm text-slate-500 font-medium">Try adjusting your search or filter criteria.</p>
            {(searchTerm || mobilityFilter !== 'ALL') && (
              <button onClick={clearFilters} className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-800">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
            {filteredResidents.map((resident) => {

              const isDischarged = resident.status === 'DISCHARGED';

              const glowColor =
                isDischarged ? 'bg-slate-400' :
                  resident.mobilityLevel === 'MEMORY' ? 'bg-rose-400' :
                    resident.mobilityLevel === 'ASSISTED' ? 'bg-blue-400' : 'bg-emerald-400';

              const targetUrl = `/dashboard/residents/${resident.residentId}`;

              return (
                <Link
                  key={resident.residentId}
                  to={isDischarged ? "#" : targetUrl}
                  className={isDischarged ? "pointer-events-none cursor-not-allowed block h-full" : "block h-full"}
                >
                  <div
                    className={`group bg-white rounded-[28px] border shadow-sm overflow-hidden flex flex-col relative h-full justify-between transition-all duration-300 ${
                      isDischarged
                        ? 'border-slate-200 opacity-60 grayscale'
                        : 'border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-slate-300 cursor-pointer'
                    }`}
                  >
                    {/* Innovative Background Glow */}
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2 transition-opacity ${!isDischarged && 'group-hover:opacity-20'} ${glowColor}`} />

                    {/* Discharged Watermark Label */}
                    {isDischarged && (
                      <div className="absolute top-5 right-5 z-20">
                        <span className="px-3 py-1 bg-slate-200 text-slate-600 text-[10px] font-extrabold uppercase tracking-widest rounded-lg border border-slate-300 shadow-sm">
                          Discharged
                        </span>
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-1 relative z-10">

                      {/* Top Row: Avatar & Actions */}
                      <div className="flex justify-between items-start mb-5">
                        <div className={`w-14 h-14 rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-center text-xl font-black text-slate-400 shadow-sm transition-colors ${!isDischarged && 'group-hover:bg-white group-hover:text-blue-600'}`}>
                          {resident.firstName.charAt(0)}{resident.lastName.charAt(0)}
                        </div>
                      </div>

                      {/* Identity Info */}
                      <div className="mb-6">
                        <h3 className={`text-xl font-extrabold text-slate-900 tracking-tight mb-1.5 transition-colors line-clamp-1 ${!isDischarged && 'group-hover:text-blue-600'}`}>
                          {resident.firstName} {resident.lastName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                          <Bed className="w-4 h-4 text-slate-400" />
                          Room {resident.room || 'Unassigned'}
                        </div>
                      </div>

                      {/* Edge-to-Edge Clinical Data Ribbon */}
                      <div className="flex items-center justify-between py-4 border-y border-slate-100/80 mt-auto mb-5 bg-slate-50/50 -mx-6 px-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Stethoscope className="w-3 h-3" /> MRN</span>
                          <span className="text-sm font-bold text-slate-700">{resident.mrn}</span>
                        </div>
                        <div className="w-px h-8 bg-slate-200/60" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Age</span>
                          <span className="text-sm font-bold text-slate-700">{calculateAge(resident.birthDate)} <span className="text-xs font-medium text-slate-500">yrs</span></span>
                        </div>
                        <div className="w-px h-8 bg-slate-200/60" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><User className="w-3 h-3" /> Sex</span>
                          <span className="text-sm font-bold text-slate-700 capitalize">{resident.gender.toLowerCase()}</span>
                        </div>
                      </div>

                      {/* Footer: Badge & Detail Link */}
                      <div className="flex items-center justify-between">
                        {isDischarged ? (
                          <span className="px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-widest border flex items-center gap-1.5 w-fit text-slate-500 bg-slate-100 border-slate-200">
                            Discharged
                          </span>
                        ) : (
                          <MobilityBadge level={resident.mobilityLevel} />
                        )}

                        {!isDischarged && (
                          <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                            View Profile <ChevronDown className="w-3 h-3 -rotate-90" />
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default Residents;