import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
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
  Edit2,
  Trash2,
  Loader2,
  Save,
  AlertCircle,
  Stethoscope
} from "lucide-react";
import { GET_RESIDENTS } from '../../features/residents/graphql/queries';
import { REGISTER_RESIDENT } from '../../features/residents/graphql/mutations';
import type { ResidentType } from '../../lib/graphql/generated';

const DISCHARGE_RESIDENT = gql`
  mutation DischargeResident($id: String!) {
    dischargeResident(id: $id) {
      id
    }
  }
`;

// Assuming a medical profile update exists based on your operations summary
const UPDATE_RESIDENT = gql`
  mutation UpdateResidentMedicalProfile($input: UpdateResidentMedicalProfileInputGql!) {
    updateResidentMedicalProfile(input: $input) {
      id
    }
  }
`;

// --- HELPER FUNCTIONS ---
const calculateAge = (dobString: string) => {
  if (!dobString) return 0;
  const birthday = new Date(dobString);
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// --- INTERNAL COMPONENT: RESIDENT FORM ---
const ResidentSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'Name too short').required('Required'),
  lastName: Yup.string().min(2, 'Name too short').required('Required'),
  mrn: Yup.string().required('Medical Record Number is required'),
  birthDate: Yup.string().required('Birth date is required'),
  gender: Yup.string().required('Required'),
  mobilityLevel: Yup.string().required('Required'),
  room: Yup.string().required('Room is required'),
});

interface ResidentFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: ResidentType | null;
  refetch: () => void;
}

function ResidentForm({ isOpen, onClose, initialValues, refetch }: ResidentFormProps) {
  const isEditMode = !!initialValues;

  const [registerResident] = useMutation(REGISTER_RESIDENT);
  const [updateResident] = useMutation(UPDATE_RESIDENT);

  const formik = useFormik({
    initialValues: initialValues || {
      id: '',
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
        if (isEditMode) {
          // In a real scenario, map this to your exact update input
          await updateResident({
            variables: {
              input: {
                residentId: values.id,
                mobilityLevel: values.mobilityLevel,
                room: values.room,
              }
            }
          });
        } else {
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
        }
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
          
          {formik.status && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {formik.status}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">First Name</label>
                <input
                  {...formik.getFieldProps('firstName')}
                  disabled={isEditMode}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:text-slate-400"
                  placeholder="Eleanor"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Last Name</label>
                <input
                  {...formik.getFieldProps('lastName')}
                  disabled={isEditMode}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:text-slate-400"
                  placeholder="Rigby"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Birth Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    {...formik.getFieldProps('birthDate')}
                    disabled={isEditMode}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:text-slate-400 text-slate-700"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Gender</label>
                <select
                  {...formik.getFieldProps('gender')}
                  disabled={isEditMode}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none text-slate-700"
                >
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                  <option value="OTHER">Other</option>
                  <option value="UNSPECIFIED">Unspecified</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4" /> Admission & Care
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">MRN</label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    {...formik.getFieldProps('mrn')}
                    disabled={isEditMode}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:text-slate-400 uppercase"
                    placeholder="MRN-12345"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Room No.</label>
                <div className="relative">
                  <Bed className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    {...formik.getFieldProps('room')}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all uppercase"
                    placeholder="104-B"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 ml-1">Mobility & Care Level</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'INDEPENDENT', label: 'Independent', color: 'emerald' },
                  { id: 'ASSISTED', label: 'Assisted', color: 'blue' },
                  { id: 'MEMORY', label: 'Memory Care', color: 'rose' },
                ].map((level) => (
                  <label 
                    key={level.id}
                    className={`
                      flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer text-center transition-all
                      ${formik.values.mobilityLevel === level.id 
                        ? `bg-${level.color}-50 border-${level.color}-500 text-${level.color}-700`
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}
                    `}
                  >
                    <input type="radio" name="mobilityLevel" value={level.id} onChange={formik.handleChange} className="hidden" />
                    <span className="text-[10px] font-bold uppercase tracking-wider leading-tight">{level.label}</span>
                  </label>
                ))}
              </div>
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
  const [editingResident, setEditingResident] = useState<ResidentType | null>(null);

  // Queries & Mutations
  const { data, loading, error, refetch } = useQuery(GET_RESIDENTS, {
    variables: { search: searchTerm || undefined },
    fetchPolicy: 'cache-and-network'
  });

  const [dischargeResident] = useMutation(DISCHARGE_RESIDENT);

  const residents: ResidentType[] = data?.residentList || [];

  // Computed Stats
  const totalResidents = residents.length;
  const memoryCareCount = residents.filter(r => r.mobilityLevel === 'MEMORY').length;
  const assistedCount = residents.filter(r => r.mobilityLevel === 'ASSISTED').length;

  // Handlers
  const handleEdit = (resident: ResidentType) => {
    // Format date for the HTML date picker if needed
    const formattedResident = {
      ...resident,
      birthDate: resident.birthDate ? new Date(resident.birthDate).toISOString().split('T')[0] : ''
    };
    setEditingResident(formattedResident);
    setIsDrawerOpen(true);
  };

  const handleCreate = () => {
    setEditingResident(null);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to discharge this resident? This action cannot be undone.')) {
      try {
        await dischargeResident({ variables: { id } });
        refetch();
      } catch (err) {
        alert('Failed to discharge resident.');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      
      <ResidentForm 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        initialValues={editingResident}
        refetch={refetch}
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
              placeholder="Search by name, room, or MRN..." 
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none outline-none text-slate-700 font-medium placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && refetch()}
            />
          </div>
          <button 
            onClick={() => refetch()}
            className="px-6 border-l border-slate-100 text-slate-500 hover:text-blue-600 hover:bg-slate-50 font-bold text-sm flex items-center gap-2 transition-colors rounded-r-xl"
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Mini Stats Group */}
        <div className="lg:col-span-6 xl:col-span-4 grid grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
            <p className="text-2xl font-black text-slate-900 leading-none">{totalResidents}</p>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">Memory Care</p>
            <p className="text-2xl font-black text-rose-700 leading-none">{memoryCareCount}</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Assisted</p>
            <p className="text-2xl font-black text-blue-700 leading-none">{assistedCount}</p>
          </div>
        </div>
      </div>

      {/* Main Data Area */}
      {loading && !data ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
          <p className="text-sm font-semibold">Loading resident records...</p>
        </div>
      ) : error ? (
        <div className="py-12 px-6 flex items-center justify-center text-red-600 bg-red-50/50 rounded-3xl border border-red-100">
          <AlertCircle className="w-6 h-6 mr-3" />
          <p className="text-sm font-bold">Error loading residents: {error.message}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {residents.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-slate-200 border-dashed">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No residents found</h3>
              <p className="text-slate-500 font-medium">Try adjusting your search filters or admit a new resident.</p>
            </div>
          ) : (
            residents.map((resident) => (
              <div key={resident.id} className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col h-full">
                
                {/* Dynamic Care Level Top Border */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 transition-colors ${
                  resident.mobilityLevel === 'MEMORY' ? 'bg-rose-500' : 
                  resident.mobilityLevel === 'ASSISTED' ? 'bg-blue-500' : 'bg-emerald-400'
                }`} />

                <div className="flex justify-between items-start mb-6 pt-2">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-xl font-black text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-inner">
                      {resident.firstName.charAt(0)}{resident.lastName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 leading-tight">{resident.firstName} {resident.lastName}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                        <Bed className="w-4 h-4 text-slate-400" />
                        <span className="font-bold text-slate-600">Room {resident.room}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center h-full">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5" /> MRN
                      </p>
                      <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 uppercase">{resident.mrn}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Gender
                      </p>
                      <span className="text-xs font-bold text-slate-700 capitalize">{resident.gender.toLowerCase()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 mt-2 border-t border-slate-100">
                   <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-1.5
                    ${resident.mobilityLevel === 'MEMORY' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 
                      resident.mobilityLevel === 'ASSISTED' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                      'bg-emerald-50 text-emerald-700 border border-emerald-100'}
                   `}>
                    <Activity className="w-4 h-4" />
                    {resident.mobilityLevel.replace('_', ' ')}
                   </span>
                   <span className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                     {calculateAge(resident.birthDate)} yrs
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
      )}
    </div>
  );
}

export default Residents;