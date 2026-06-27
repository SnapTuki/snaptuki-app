import { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Link } from 'react-router-dom'; // <-- Added Router Link
import {
  Search,
  X,
  UserPlus,
  FileText,
  Users,
  Settings,
  Check,
  AlertCircle
} from "lucide-react";
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { GET_RESIDENT_SUGGESTIONS} from '../../../features/residents/graphql/queries';
import { type ResidentType } from '../../../lib/graphql/generated';
import { REGISTER_RESIDENT } from '../../../features/residents/graphql/mutations';
import { useAuthStore } from '../../../lib/store/authStore';

/**
 * --- HELPER UI COMPONENTS ---
 */
function HeaderAction({ icon: Icon, label, onClick, primary = false }: { icon: any, label: string, onClick: () => void, primary?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all backdrop-blur-md shadow-sm border ${
        primary 
        ? 'bg-blue-600/90 hover:bg-blue-600 border-blue-500 text-white shadow-blue-500/20' 
        : 'bg-white/60 hover:bg-white hover:shadow-md border-slate-200 text-slate-700'
      }`}
    >
      <Icon className={`w-4 h-4 ${primary ? 'text-white' : 'text-slate-500'}`} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

const NotificationToast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 15000); // 15 seconds
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-[200] px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
      {type === 'success' ? <Check className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-md ml-2 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * --- MAIN PAGE COMPONENT ---
 */
export function Residents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user } = useAuthStore();
  
  // Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);

  const { data, error, refetch } = useQuery(GET_RESIDENT_SUGGESTIONS, {
    fetchPolicy: 'cache-and-network'
  });
  const [registerResident] = useMutation(REGISTER_RESIDENT);

  const residents: ResidentType[] = data?.residentList || [];

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

  // --- FORMIK: Add Resident Form ---
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: '',
      ssn: '',
      room: '',
      mobilityLevel: '',
      emergencyContactPhone: '',
      emergencyContactEmail: '',
      emergencyContactName: '',
      emergencyContactRelation: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      birthDate: Yup.string().required('Date of birth is required'),
      gender: Yup.string().required('Gender is required'),
      ssn: Yup.string().required('SSN is required'),
      room: Yup.string().required('Room assignment is required'),
      mobilityLevel: Yup.string().required('Mobility level is required'),
      emergencyContactPhone: Yup.string().required('Emergency contact phone is required'),
      emergencyContactEmail: Yup.string().email('Invalid email address').optional(),
      emergencyContactName: Yup.string().required('Contact Name is required'),
      emergencyContactRelation: Yup.string().required('Relationship to resident is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const emergencyContacts = [{
        name: values.emergencyContactName,
        phone: values.emergencyContactPhone,
        relation: values.emergencyContactRelation,
        email: values.emergencyContactEmail
      }];

      const newResidentInput = {
        agencyId: user?.agencyId,
        firstName: values.firstName,
        lastName: values.lastName,
        ssn: values.ssn,
        birthDate: values.birthDate,
        gender: values.gender,
        mobilityLevel: values.mobilityLevel,
        emergencyContacts: emergencyContacts,
        room: values.room
      };

      try {
        await registerResident({
          variables: { input: newResidentInput }
        });
        await refetch();
        resetForm();
        setIsAddModalOpen(false);
        setNotification({ message: `${values.firstName} ${values.lastName} has been successfully admitted.`, type: 'success' });
      } catch (err) {
        console.error("Error creating resident:", err);
        setNotification({ message: 'Failed to admit resident. Please try again or contact IT.', type: 'error' });
      }
    }
  });

  if (error) console.error("GraphQL Error:", error);

  return (
    <div className="relative flex flex-col h-[calc(100vh-4rem)] bg-slate-50 overflow-hidden font-sans">
      
      {/* GLOBAL NOTIFICATIONS */}
      <NotificationToast 
        message={notification?.message || ''} 
        type={notification?.type || 'success'} 
        onClose={() => setNotification(null)} 
      />

      {/* FIXED TRANSPARENT HEADER */}
      <header className="absolute top-0 left-0 right-0 z-40 bg-transparent pointer-events-none">
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="pointer-events-auto"></div>
          
          <div className="flex items-center gap-3 pointer-events-auto">
             <HeaderAction icon={FileText} label="Print Roster" onClick={() => console.log('Print')} />
             <HeaderAction icon={Users} label="Family Contacts" onClick={() => console.log('Contacts')} />
             <HeaderAction icon={Settings} label="Facility Settings" onClick={() => console.log('Settings')} />
             <HeaderAction primary icon={UserPlus} label="Admit Resident" onClick={() => setIsAddModalOpen(true)} />
          </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto w-full relative z-10 pt-28 pb-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="max-w-3xl w-full text-center mb-8">
             <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
               Find a Resident
             </h1>
             <p className="text-lg text-slate-500 font-medium">
               Enter a Medical Record Number or search a name to open their clinical profile.
             </p>
          </div>

          <div className="relative w-full max-w-3xl group" ref={searchRef}>
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search MRN or Name..."
              className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200/80 rounded-2xl text-xl font-medium shadow-lg shadow-slate-200/50 focus:shadow-xl focus:shadow-blue-500/10 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full right-0 left-0 mt-4 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                {suggestions.map((r, index) => (
                  <Link
                    key={r.residentId}
                    to={`/dashboard/residents/${r.residentId}`}
                    className={`w-full flex items-center gap-4 p-4 hover:bg-blue-50 transition-colors text-left ${index !== suggestions.length - 1 ? 'border-b border-slate-100' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg shrink-0">
                      {r.firstName[0]}{r.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-slate-900">
                        {r.firstName} {r.lastName}
                      </div>
                      <div className="text-sm text-slate-500 font-semibold mt-0.5">
                        MRN: {r.mrn} <span className="mx-2">•</span> Room {r.room}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- FORMIK MODAL: ADMIT RESIDENT --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="px-8 py-6 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><UserPlus className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Admit New Resident</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Create a clinical profile and care plan</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 bg-slate-50/50">
              <form onSubmit={formik.handleSubmit} className="p-8">
                
                {/* SECTION 1: Personal Details */}
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Resident Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">First Name <span className="text-rose-500">*</span></label>
                    <input 
                      name="firstName"
                      type="text"
                      className={`w-full px-5 py-3 border rounded-xl text-base outline-none transition-all shadow-sm ${formik.errors.firstName && formik.touched.firstName ? 'border-red-300 bg-red-50 focus:ring-red-500/20' : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500/20'}`}
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.firstName && formik.touched.firstName && <p className="text-xs font-semibold text-red-600 mt-2">{formik.errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Last Name <span className="text-rose-500">*</span></label>
                    <input 
                      name="lastName"
                      type="text"
                      className={`w-full px-5 py-3 border rounded-xl text-base outline-none transition-all shadow-sm ${formik.errors.lastName && formik.touched.lastName ? 'border-red-300 bg-red-50 focus:ring-red-500/20' : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500/20'}`}
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.lastName && formik.touched.lastName && <p className="text-xs font-semibold text-red-600 mt-2">{formik.errors.lastName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Date of Birth <span className="text-rose-500">*</span></label>
                    <input 
                      name="birthDate"
                      type="date"
                      className={`w-full px-5 py-3 border rounded-xl text-base outline-none transition-all shadow-sm ${formik.errors.birthDate && formik.touched.birthDate ? 'border-red-300 bg-red-50 focus:ring-red-500/20' : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500/20'}`}
                      value={formik.values.birthDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.birthDate && formik.touched.birthDate && <p className="text-xs font-semibold text-red-600 mt-2">{formik.errors.birthDate}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Gender <span className="text-rose-500">*</span></label>
                    <select 
                      name="gender"
                      className={`w-full px-5 py-3 border rounded-xl text-base outline-none transition-all shadow-sm appearance-none ${formik.errors.gender && formik.touched.gender ? 'border-red-300 bg-red-50 focus:ring-red-500/20' : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500/20'}`}
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="" disabled>Select Gender...</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other </option>
                    </select>
                    {formik.errors.gender && formik.touched.gender && <p className="text-xs font-semibold text-red-600 mt-2">{formik.errors.gender}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Social Security Number <span className="text-rose-500">*</span></label>
                    <input 
                      name="ssn"
                      type="text"
                      placeholder="XXX-XX-XXXX"
                      className={`w-full px-5 py-3 border rounded-xl text-base outline-none transition-all shadow-sm ${formik.errors.ssn && formik.touched.ssn ? 'border-red-300 bg-red-50 focus:ring-red-500/20' : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500/20'}`}
                      value={formik.values.ssn}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.ssn && formik.touched.ssn && <p className="text-xs font-semibold text-red-600 mt-2">{formik.errors.ssn}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Room Assignment <span className="text-rose-500">*</span></label>
                    <input 
                      name="room"
                      type="text"
                      placeholder="e.g., 204B"
                      className={`w-full px-5 py-3 border rounded-xl text-base outline-none transition-all shadow-sm ${formik.errors.room && formik.touched.room ? 'border-red-300 bg-red-50 focus:ring-red-500/20' : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500/20'}`}
                      value={formik.values.room}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.room && formik.touched.room && <p className="text-xs font-semibold text-red-600 mt-2">{formik.errors.room}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Mobility Level <span className="text-rose-500">*</span></label>
                    <select
                      name="mobilityLevel"
                      className={`w-full px-5 py-3 border rounded-xl text-base outline-none transition-all shadow-sm appearance-none ${formik.errors.mobilityLevel && formik.touched.mobilityLevel ? 'border-red-300 bg-red-50 focus:ring-red-500/20' : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500/20'}`}
                      value={formik.values.mobilityLevel}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="" disabled>Select Mobility Level...</option>
                      <option value="Independent">Independent</option>
                      <option value="Assisted">Assisted (Walker / Cane / Staff)</option>
                      <option value="Memory">Memory Care / Restricted</option>
                    </select>
                    {formik.errors.mobilityLevel && formik.touched.mobilityLevel && <p className="text-xs font-semibold text-red-600 mt-2">{formik.errors.mobilityLevel}</p>}
                  </div>
                </div>

                {/* SECTION 2: Emergency Contact */}
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Contact Phone <span className="text-rose-500">*</span></label>
                    <input 
                      name="emergencyContactPhone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className={`w-full px-5 py-3 border rounded-xl text-base outline-none transition-all shadow-sm ${formik.errors.emergencyContactPhone && formik.touched.emergencyContactPhone ? 'border-red-300 bg-red-50 focus:ring-red-500/20' : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500/20'}`}
                      value={formik.values.emergencyContactPhone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.emergencyContactPhone && formik.touched.emergencyContactPhone && <p className="text-xs font-semibold text-red-600 mt-2">{formik.errors.emergencyContactPhone}</p>}
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Name <span className="text-rose-500">*</span></label>
                    <input 
                      name="emergencyContactName"
                      type="text"
                      placeholder="Name"
                      className={`w-full px-5 py-3 border rounded-xl text-base outline-none transition-all shadow-sm ${formik.errors.emergencyContactName && formik.touched.emergencyContactName ? 'border-red-300 bg-red-50 focus:ring-red-500/20' : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500/20'}`}
                      value={formik.values.emergencyContactName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.emergencyContactName && formik.touched.emergencyContactName && <p className="text-xs font-semibold text-red-600 mt-2">{formik.errors.emergencyContactName}</p>}
                  </div>
                   
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Relationship <span className="text-rose-500">*</span></label>
                    <input 
                      name="emergencyContactRelation"
                      type="text"
                      placeholder="e.g., Daughter, Spouse"
                      className={`w-full px-5 py-3 border rounded-xl text-base outline-none transition-all shadow-sm ${formik.errors.emergencyContactRelation && formik.touched.emergencyContactRelation ? 'border-red-300 bg-red-50 focus:ring-red-500/20' : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500/20'}`}
                      value={formik.values.emergencyContactRelation}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.emergencyContactRelation && formik.touched.emergencyContactRelation && <p className="text-xs font-semibold text-red-600 mt-2">{formik.errors.emergencyContactRelation}</p>}
                  </div>

                  <div className="md:col-span-2">
                  
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Contact Email (Optional)</label>
                    <input 
                      name="emergencyContactEmail"
                      type="email"
                      placeholder="contact@example.com"
                      className={`w-full px-5 py-3 border rounded-xl text-base outline-none transition-all shadow-sm ${formik.errors.emergencyContactEmail && formik.touched.emergencyContactEmail ? 'border-red-300 bg-red-50 focus:ring-red-500/20' : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500/20'}`}
                      value={formik.values.emergencyContactEmail}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.emergencyContactEmail && formik.touched.emergencyContactEmail && <p className="text-xs font-semibold text-red-600 mt-2">{formik.errors.emergencyContactEmail}</p>}
                  </div>
                </div>

              </form>
            </div>

            {/* ACTION FOOTER */}
            <div className="px-8 py-5 border-t border-slate-100 bg-white shrink-0 flex gap-4">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                Cancel
              </button>
              <button type="button" onClick={() => formik.handleSubmit()} className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20">
                Admit Resident
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}

export default Residents;