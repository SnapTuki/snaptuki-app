import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Bed, 
  HeartPulse, 
  Activity, 
  Calendar, 
  MapPin, 
  X,
  User,
  FileText,
  Edit2,
  Trash2,
  Loader2,
  Save,
  ShieldAlert
} from "lucide-react";

// --- TYPES ---
interface Resident {
  id: string;
  fullName: string;
  roomNumber: string;
  age: number;
  careLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'hospitalized';
  condition: string;
}

// --- MOCK DATA ---
const MOCK_RESIDENTS: Resident[] = [
  { id: '1', fullName: 'Eleanor Rigby', age: 82, roomNumber: '101', careLevel: 'low', status: 'active', condition: 'Hypertension, mild arthritis' },
  { id: '2', fullName: 'Arthur Dent', age: 74, roomNumber: '104-A', careLevel: 'high', status: 'active', condition: 'Post-Stroke Recovery, mobility assistance' },
  { id: '3', fullName: 'Martha Jones', age: 89, roomNumber: '202', careLevel: 'medium', status: 'hospitalized', condition: 'Dementia, fall risk' },
  { id: '4', fullName: 'John Smith', age: 79, roomNumber: '105', careLevel: 'low', status: 'active', condition: 'Dietary management (Diabetes)' },
  { id: '5', fullName: 'Clara Oswald', age: 85, roomNumber: '301', careLevel: 'high', status: 'active', condition: 'Severe mobility impairment, daily physio' },
];

// --- INTERNAL COMPONENT: RESIDENT FORM ---
const ResidentSchema = Yup.object().shape({
  fullName: Yup.string().min(2, 'Name too short').required('Full name is required'),
  roomNumber: Yup.string().required('Room is required'),
  age: Yup.number().positive('Must be positive').integer('Must be whole number').required('Age is required'),
  careLevel: Yup.string().required('Care level is required'),
  condition: Yup.string().required('Primary condition is required'),
});

interface ResidentFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: Resident | null;
  onSubmit: (values: any) => void;
}

function ResidentForm({ isOpen, onClose, initialValues, onSubmit }: ResidentFormProps) {
  const isEditMode = !!initialValues;

  const formik = useFormik({
    initialValues: initialValues || {
      id: '',
      fullName: '',
      roomNumber: '',
      age: '',
      careLevel: 'medium',
      status: 'active',
      condition: '',
    },
    enableReinitialize: true,
    validationSchema: ResidentSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API delay
      
      const payload = {
        ...values,
        id: initialValues?.id || Math.random().toString(36).substr(2, 9),
      };
      
      onSubmit(payload);
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
        
        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEditMode ? 'Edit Resident Profile' : 'Admit New Resident'}
            </h2>
            <p className="text-sm text-slate-500">
              {isEditMode ? 'Update medical and lodging records' : 'Register a new individual to the facility'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Details
            </h3>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
              <input
                {...formik.getFieldProps('fullName')}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.fullName && formik.errors.fullName ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
                placeholder="e.g. Eleanor Rigby"
              />
              {formik.touched.fullName && formik.errors.fullName && <div className="text-red-500 text-xs ml-1 font-medium">{formik.errors.fullName as string}</div>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    {...formik.getFieldProps('age')}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="82"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Room No.</label>
                <div className="relative">
                  <Bed className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    {...formik.getFieldProps('roomNumber')}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="104-B"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4" /> Care Profile
            </h3>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 ml-1">Care Intensity Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map((level) => (
                  <label 
                    key={level}
                    className={`
                      flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all
                      ${formik.values.careLevel === level 
                        ? level === 'high' ? 'bg-rose-50 border-rose-500 text-rose-700' : 
                          level === 'medium' ? 'bg-blue-50 border-blue-500 text-blue-700' : 
                          'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}
                    `}
                  >
                    <input type="radio" name="careLevel" value={level} onChange={formik.handleChange} className="hidden" />
                    <HeartPulse className={`w-5 h-5 mb-1 ${formik.values.careLevel === level ? '' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Primary Condition / Notes</label>
              <textarea
                {...formik.getFieldProps('condition')}
                rows={4}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition-all"
                placeholder="e.g. Dementia, requires assistance with mobility..."
              />
              {formik.touched.condition && formik.errors.condition && <div className="text-red-500 text-xs ml-1 font-medium">{formik.errors.condition as string}</div>}
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button onClick={onClose} type="button" className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting}
            type="submit"
            className="flex-[2] py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {formik.isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            {isEditMode ? 'Update Record' : 'Admit Resident'}
          </button>
        </div>
      </div>
    </>
  );
}


// --- MAIN PAGE COMPONENT ---
export function Residents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [residents, setResidents] = useState<Resident[]>(MOCK_RESIDENTS);

  // Computed Stats
  const totalResidents = residents.length;
  const highCareCount = residents.filter(r => r.careLevel === 'high').length;
  const hospitalizedCount = residents.filter(r => r.status === 'hospitalized').length;

  const filteredResidents = residents.filter(r => 
    r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleEdit = (resident: Resident) => {
    setEditingResident(resident);
    setIsDrawerOpen(true);
  };

  const handleCreate = () => {
    setEditingResident(null);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to discharge this resident? This action cannot be undone.')) {
      setResidents(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleFormSubmit = (data: Resident) => {
    if (editingResident) {
      setResidents(prev => prev.map(r => r.id === data.id ? data : r));
    } else {
      setResidents(prev => [data, ...prev]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ResidentForm 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        initialValues={editingResident}
        onSubmit={handleFormSubmit}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Resident Directory</h1>
          <p className="text-slate-500 font-medium mt-1">Manage admissions, care levels, and lodging assignments.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Admit Resident
        </button>
      </div>

      {/* Control Bar & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Search & Filter */}
        <div className="lg:col-span-6 xl:col-span-8 bg-white p-2 rounded-2xl border border-slate-200 flex shadow-sm">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, room, or condition..." 
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none outline-none text-slate-700 font-medium placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 border-l border-slate-100 text-slate-500 hover:text-blue-600 hover:bg-slate-50 font-bold text-sm flex items-center gap-2 transition-colors rounded-r-xl">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Mini Stats Group */}
        <div className="lg:col-span-6 xl:col-span-4 grid grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
            <p className="text-2xl font-black text-slate-900 leading-none">{totalResidents}</p>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">High Care</p>
            <p className="text-2xl font-black text-rose-700 leading-none">{highCareCount}</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Hospitalized</p>
            <p className="text-2xl font-black text-amber-700 leading-none">{hospitalizedCount}</p>
          </div>
        </div>
      </div>

      {/* Resident Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredResidents.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-[32px] border border-slate-200 border-dashed">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No residents found</h3>
            <p className="text-slate-500 font-medium">Try adjusting your search filters.</p>
          </div>
        ) : (
          filteredResidents.map((resident) => (
            <div key={resident.id} className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col h-full">
              
              {/* Dynamic Status/Care Level Top Border */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 transition-colors ${
                resident.status === 'hospitalized' ? 'bg-amber-400' :
                resident.careLevel === 'high' ? 'bg-rose-500' : 
                resident.careLevel === 'medium' ? 'bg-blue-500' : 'bg-emerald-400'
              }`} />

              <div className="flex justify-between items-start mb-6 pt-2">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-xl font-black text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-inner">
                    {resident.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 leading-tight">{resident.fullName}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                      <Bed className="w-4 h-4 text-slate-400" />
                      <span className="font-bold text-slate-600">Room {resident.roomNumber}</span>
                    </div>
                  </div>
                </div>
                
                {/* Hospitalized Badge Overlay */}
                {resident.status === 'hospitalized' && (
                  <div className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Out
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-3 h-full">
                  <FileText className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Primary Condition</p>
                    <p className="text-sm font-semibold text-slate-700 leading-snug">{resident.condition}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 mt-2 border-t border-slate-100">
                 <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-1.5
                  ${resident.careLevel === 'high' ? 'bg-rose-50 text-rose-700' : 
                    resident.careLevel === 'medium' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}
                 `}>
                  <Activity className="w-4 h-4" />
                  {resident.careLevel} Care
                 </span>
                 <span className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                   {resident.age} yrs
                 </span>
              </div>

              {/* Quick Actions (Hover Reveal Overlay) */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-white/95 backdrop-blur-sm border-t border-slate-200 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 ease-out flex gap-3 shadow-[-10px_-10px_30px_rgba(0,0,0,0.03)]">
                <button 
                  onClick={() => handleEdit(resident)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl font-bold text-sm transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
                <button 
                  onClick={() => handleDelete(resident.id)}
                  className="flex-none flex items-center justify-center p-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold transition-colors"
                  title="Discharge"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Residents;