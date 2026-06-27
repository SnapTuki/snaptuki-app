import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { 
  Search, 
  MapPin,
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Shield,
  Loader2,
  Save,
  UserX,
  AlertCircle,
  Lock,
  Calendar,
  Award,
  GraduationCap,
  Activity,
  ChevronDown,
  MoreVertical,
  AlignJustify,
  Grid
} from "lucide-react";

// --- GRAPHQL OPERATIONS ---
import { GET_CAREGIVERS } from '../../features/caregivers/graphql/queries';
import type { StaffType } from '../../lib/graphql/generated';
import { StaffRole } from '../../lib/graphql/generated';
import { REGISTER_CAREGIVER } from '../../features/caregivers/graphql/mutations';

const UPDATE_CAREGIVER = gql`
  mutation UpdateCaregiverContact($input: UpdateCaregiverContactInputGql!) {
    updateCaregiverContact(input: $input) {
      id
    }
  }
`;

const DEACTIVATE_CAREGIVER = gql`
  mutation DeactivateCaregiver($id: String!) {
    deactivateCaregiver(id: $id) {
      id
    }
  }
`;

// --- HELPER FUNCTIONS ---
const generateSecurePassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let pass = "";
  for (let i = 0; i < 14; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

// --- HELPER COMPONENTS ---
function StatusDot({ status }: { status: string }) {
  const isAvailable = status === 'ACTIVE';
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-[#00c9c9]' : 'bg-rose-500'}`} />
      <span className={`text-sm font-semibold ${isAvailable ? 'text-[#00c9c9]' : 'text-rose-500'}`}>
        {isAvailable ? 'Available' : 'Out'}
      </span>
    </div>
  );
}

// --- INTERNAL COMPONENT: ADD CAREGIVER DRAWER ---
interface CaregiverFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  city: string;
  employmentType: string;
  hireDate: string;
  password?: string; 
}

const CaregiverAddSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'Too short').required('Required'),
  lastName: Yup.string().min(2, 'Too short').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string().required('Required'),
  city: Yup.string().required('Required'), 
  role: Yup.string().required('Required'),
  employmentType: Yup.string().required('Required'),
  hireDate: Yup.string().required('Required'),
  password: Yup.string().required('Password is required'), 
});

interface CaregiverAddDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

function CaregiverAddDrawer({ isOpen, onClose, refetch }: CaregiverAddDrawerProps) {
  const [registerCaregiver] = useMutation(REGISTER_CAREGIVER);

  const formik = useFormik<CaregiverFormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      role: StaffRole.Nurse,
      employmentType: 'FULL_TIME',
      hireDate: new Date().toISOString().split('T')[0],
      password: '', 
    },
    validationSchema: CaregiverAddSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setStatus }) => {
      try {
        await registerCaregiver({
          variables: {
            input: {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              phone: values.phone,
              role: values.role,
              passwordHash: values.password,
              employmentType: values.employmentType,
              hireDate: new Date(values.hireDate).toISOString(),
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

  useEffect(() => {
    if (isOpen) {
      formik.setFieldValue('password', generateSecurePassword());
    } else {
      formik.resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 border-l border-slate-100 flex flex-col">
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">New Staff Member</h2>
            <p className="text-sm text-slate-500">Register new personnel to Snaptuki</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {formik.status && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {formik.status}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  {...formik.getFieldProps('firstName')}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00c9c9]/20 outline-none transition-all"
                  placeholder="Sarah"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Last Name</label>
              <input
                {...formik.getFieldProps('lastName')}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00c9c9]/20 outline-none transition-all"
                placeholder="Miller"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                {...formik.getFieldProps('email')}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00c9c9]/20 outline-none transition-all"
                placeholder="staff@snaptuki.care"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Temporary Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                readOnly
                {...formik.getFieldProps('password')}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-700 font-mono outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  {...formik.getFieldProps('phone')}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00c9c9]/20 outline-none transition-all"
                  placeholder="+358..."
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  {...formik.getFieldProps('city')}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00c9c9]/20 outline-none transition-all"
                  placeholder="Helsinki"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Employment</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <select
                  {...formik.getFieldProps('employmentType')}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00c9c9]/20 outline-none transition-all appearance-none text-slate-700 font-medium"
                >
                  <option value="FULL_TIME">Full-Time</option>
                  <option value="PART_TIME">Part-Time</option>
                  <option value="CONTRACT">Contract</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Hire Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  {...formik.getFieldProps('hireDate')}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00c9c9]/20 outline-none transition-all text-slate-700"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Role Assignment</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'HEAD_NURSE', label: 'Head Nurse', icon: Shield },
                { id: 'CAREGIVER', label: 'Caregiver', icon: User },
                { id: 'COORDINATOR', label: 'Coordinator', icon: Briefcase },
              ].map((role) => (
                <label 
                  key={role.id}
                  className={`
                    relative flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${formik.values.role === role.id ? 'border-[#00c9c9] bg-[#00c9c9]/5 text-[#00c9c9]' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'}
                  `}
                >
                  <input type="radio" name="role" value={role.id} onChange={formik.handleChange} className="hidden" />
                  <role.icon className={`w-5 h-5 ${formik.values.role === role.id ? 'text-[#00c9c9]' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold">{role.label}</span>
                </label>
              ))}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            Cancel
          </button>
          <button 
            type="button"
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting}
            className="flex-[2] py-3 px-4 bg-[#00c9c9] text-white font-bold rounded-xl hover:bg-[#00b0b0] shadow-lg shadow-[#00c9c9]/20 disabled:opacity-70 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {formik.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Register Staff
          </button>
        </div>
      </div>
    </>
  );
}

// --- FULL-WIDTH PROFILE MODAL (VIEW/EDIT) ---
interface CaregiverProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  caregiver: StaffType | null;
  refetch: () => void;
}

function CaregiverProfileModal({ isOpen, onClose, caregiver, refetch }: CaregiverProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EMPLOYMENT' | 'CERTIFICATIONS'>('OVERVIEW');
  const [updateCaregiver] = useMutation(UPDATE_CAREGIVER);
  const [deactivateCaregiver] = useMutation(DEACTIVATE_CAREGIVER);

  const formik = useFormik({
    initialValues: caregiver || { id: '', firstName: '', lastName: '', email: '', phone: '', city: '', role: '', employmentType: '', hireDate: '', status: '' },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await updateCaregiver({
          variables: {
            input: {
              caregiverId: values.id,
              email: values.email,
              phone: values.phone,
              city: (values as any).city,
            }
          }
        });
        refetch();
        setStatus({ success: 'Contact information updated!' });
      } catch (err: any) {
        setStatus({ error: err.message || 'An error occurred while updating.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDeactivate = async () => {
    if (!caregiver) return;
    if (confirm('Are you sure you want to deactivate this staff member?')) {
      try {
        await deactivateCaregiver({ variables: { id: caregiver.id } });
        refetch();
        onClose();
      } catch (err) {
        alert('Failed to deactivate caregiver.');
      }
    }
  };

  if (!isOpen || !caregiver) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
        
        <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between bg-slate-50 relative overflow-hidden">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-3xl font-black text-slate-500 shadow-sm overflow-hidden">
                {caregiver.firstName?.charAt(0)}{caregiver.lastName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{caregiver.firstName} {caregiver.lastName}</h2>
              <div className="flex items-center gap-3 text-sm text-slate-500 mt-1 font-medium">
                <span className="capitalize text-slate-700">
                  {caregiver.role.replace('_', ' ').toLowerCase()}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {(caregiver as any).city || 'Helsinki'}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors relative z-10">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex px-8 border-b border-slate-100 bg-white pt-2">
          {[
            { id: 'OVERVIEW', label: 'Contact Overview', icon: User },
            { id: 'EMPLOYMENT', label: 'Employment Data', icon: Briefcase },
            { id: 'CERTIFICATIONS', label: 'Certifications', icon: Award },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-[#00c9c9] text-[#00c9c9]' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
          {activeTab === 'OVERVIEW' && (
            <form onSubmit={formik.handleSubmit} className="max-w-2xl space-y-6">
              {formik.status?.success && (
                <div className="p-4 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl border border-emerald-200 flex items-center gap-2">
                  <Activity className="w-5 h-5" /> {formik.status.success}
                </div>
              )}
              {formik.status?.error && (
                <div className="p-4 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> {formik.status.error}
                </div>
              )}

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                    <input {...formik.getFieldProps('email')} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#00c9c9]/20 outline-none font-medium text-slate-800 transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
                    <input {...formik.getFieldProps('phone')} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#00c9c9]/20 outline-none font-medium text-slate-800 transition-colors" />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">City / Region</label>
                    <input {...formik.getFieldProps('city')} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#00c9c9]/20 outline-none font-medium text-slate-800 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button type="button" onClick={handleDeactivate} className="px-4 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 flex items-center gap-2 transition-all">
                  <UserX className="w-4 h-4" /> Deactivate Staff
                </button>
                <button type="submit" disabled={formik.isSubmitting} className="px-6 py-3 bg-[#00c9c9] text-white font-bold rounded-xl hover:bg-[#00b0b0] shadow-lg shadow-[#00c9c9]/20 flex items-center gap-2 transition-all active:scale-[0.98]">
                  {formik.isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                  Save Contact Info
                </button>
              </div>
            </form>
          )}

          {activeTab === 'EMPLOYMENT' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400" /> Snaptuki Employment Record
                </h3>
                <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Official Role</p>
                    <p className="text-sm font-bold text-slate-900 capitalize flex items-center gap-2">
                      {caregiver.role.replace('_', ' ').toLowerCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contract Type</p>
                    <p className="text-sm font-bold text-slate-900 capitalize">
                      {(caregiver as any).employmentType?.replace('_', ' ').toLowerCase() || 'Full time'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Hire Date</p>
                    <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {(caregiver as any).hireDate ? new Date((caregiver as any).hireDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CERTIFICATIONS' && (
            <div className="max-w-3xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Registered Nurse (RN)</h4>
                    <p className="text-sm text-slate-500 mt-0.5">Finnish Nurses Association</p>
                    <div className="flex gap-3 mt-3">
                       <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-1 rounded">Issued: 2020</span>
                       <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-1 rounded border border-emerald-200">Valid</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-white">
                <Award className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-700">Need to add a certification?</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Please forward official documentation to the HR compliance team.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function CaregiversPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modals
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Selection
  const [selectedCaregiver, setSelectedCaregiver] = useState<StaffType | null>(null);

  // Queries
  const { data, loading, error, refetch } = useQuery(GET_CAREGIVERS, {
    fetchPolicy: 'cache-and-network'
  });

  const caregivers: StaffType[] = data?.caregiverList || [];

  // Initialize selected caregiver when data loads if none selected
  useEffect(() => {
    if (caregivers.length > 0 && !selectedCaregiver) {
      setSelectedCaregiver(caregivers[0]);
    }
  }, [caregivers, selectedCaregiver]);

  // --- FILTER LOGIC ---
  const filteredCaregivers = caregivers.filter((staff) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    const city = (staff as any).city?.toLowerCase() || '';
    const roleString = staff.role?.replace('_', ' ').toLowerCase() || '';
    
    const matchesSearch = !searchTerm || 
      fullName.includes(searchLower) ||
      staff.email?.toLowerCase().includes(searchLower) ||
      roleString.includes(searchLower) ||
      city.includes(searchLower);

    const matchesRole = filterRole === 'ALL' || staff.role === filterRole;
    
    // Simple availability mock since exact status isn't provided in base schema
    const status = (staff as any).status || 'ACTIVE';
    const matchesStatus = filterStatus === 'ALL' || status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRowClick = (staff: StaffType) => {
    setSelectedCaregiver(staff);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white overflow-hidden text-slate-700">
      
      {/* Drawer and Modal */}
      <CaregiverAddDrawer 
        isOpen={isAddDrawerOpen} 
        onClose={() => setIsAddDrawerOpen(false)} 
        refetch={refetch}
      />

      <CaregiverProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        caregiver={selectedCaregiver}
        refetch={refetch}
      />

      {/* =========================================
          LEFT MAIN PANEL (List View)
          ========================================= */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200">
        
        {/* Header Section */}
        <div className="px-8 pt-6 pb-4">
          <div className="text-xs text-slate-400 font-semibold mb-4 flex items-center gap-2">
            <span>Home</span> <span className="text-slate-300">&gt;</span> <span className="text-slate-600">Employees</span>
          </div>
          
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-[28px] font-normal text-slate-500">Employee Directory</h1>
            <button 
              onClick={() => setIsAddDrawerOpen(true)}
              className="border-2 border-[#00c9c9] text-[#00c9c9] hover:bg-[#00c9c9]/5 px-5 py-2 rounded font-semibold text-sm transition-colors flex items-center gap-2"
            >
              Add Employee +
            </button>
          </div>

          {/* Primary Filter Bar */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 mb-2">
            <div className="w-full">
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Type in a name..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded text-sm text-slate-600 outline-none focus:border-[#00c9c9] placeholder:text-slate-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-48">
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Department</label>
              <div className="relative">
                <select 
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm text-slate-600 outline-none focus:border-[#00c9c9] appearance-none"
                >
                  <option value="ALL">All</option>
                  <option value="HEAD_NURSE">Head Nurse</option>
                  <option value="CAREGIVER">Caregiver</option>
                  <option value="COORDINATOR">Coordinator</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="w-40">
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Availability</label>
              <div className="relative">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm text-slate-600 outline-none focus:border-[#00c9c9] appearance-none"
                >
                  <option value="ALL">All</option>
                  <option value="ACTIVE">Available</option>
                  <option value="IN_ACTIVE">Out</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-end">
              <button className="bg-[#00c9c9] hover:bg-[#00b0b0] text-white px-6 py-2 h-[38px] rounded text-sm font-semibold flex items-center gap-2 transition-colors">
                Filter <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Advanced Filter Toggle Area */}
          <div className="flex justify-center -mt-3 mb-6 relative z-10">
            <button className="bg-white border border-t-0 border-slate-200 px-4 py-1.5 rounded-b-md text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-2 shadow-sm hover:text-slate-600 transition-colors">
               <AlignJustify className="w-3 h-3" /> Advanced Filter
            </button>
          </div>

          {/* Secondary Action Bar (Search & Sort) */}
          <div className="flex justify-between items-center pb-2 border-b-2 border-slate-100">
             <div className="relative w-64">
                <Search className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Filter by name..." 
                  className="w-full pl-7 pr-4 py-1 bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Sort by:</span>
                  <div className="relative">
                    <select className="px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-600 appearance-none pr-8 outline-none focus:border-[#00c9c9]">
                      <option>Alphabetical A-Z</option>
                      <option>Alphabetical Z-A</option>
                      <option>Recently Added</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400 ml-2">
                  <AlignJustify className="w-5 h-5 cursor-pointer text-slate-700" />
                  <Grid className="w-5 h-5 cursor-pointer hover:text-slate-700" />
                </div>
             </div>
          </div>
        </div>

        {/* Scrollable Table Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-10">
          {loading && !data ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
               <Loader2 className="w-8 h-8 animate-spin mb-4 text-slate-300" />
               <p className="text-sm font-semibold">Loading directory...</p>
            </div>
          ) : error ? (
            <div className="py-8 px-6 flex items-center justify-center text-red-600 bg-red-50 rounded text-sm border border-red-200">
               <AlertCircle className="w-5 h-5 mr-3" /> Error loading staff: {error.message}
            </div>
          ) : filteredCaregivers.length === 0 ? (
            <div className="py-20 text-center">
               <UserX className="w-10 h-10 text-slate-300 mx-auto mb-3" />
               <h3 className="text-base font-semibold text-slate-600 mb-1">No matching employees found</h3>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[13px] font-bold text-slate-700">
                  <th className="py-4 px-2 w-[35%]">Name <span className="text-slate-400 ml-1 text-[10px]">♦</span></th>
                  <th className="py-4 px-2 w-[25%]">Department <span className="text-slate-400 ml-1 text-[10px]">♦</span></th>
                  <th className="py-4 px-2 w-[20%]">Phone Number</th>
                  <th className="py-4 px-2 w-[15%]">Availability <span className="text-slate-400 ml-1 text-[10px]">♦</span></th>
                  <th className="py-4 px-2 w-[5%]"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCaregivers.map((staff) => {
                  const isSelected = selectedCaregiver?.id === staff.id;
                  
                  return (
                    <tr 
                      key={staff.id} 
                      onClick={() => handleRowClick(staff)}
                      className={`
                        border-b border-slate-100 cursor-pointer transition-colors group
                        ${isSelected ? 'bg-slate-50 border-l-4 border-l-[#00c9c9] relative -left-1 pr-1' : 'hover:bg-slate-50/50'}
                      `}
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-500 overflow-hidden shrink-0">
                               {staff.firstName?.charAt(0)}{staff.lastName?.charAt(0)}
                            </div>
                            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${(staff as any).status === 'IN_ACTIVE' ? 'bg-rose-500' : 'bg-[#00c9c9]'}`} />
                          </div>
                          <div className="min-w-0">
                            <p className={`text-[15px] font-bold ${isSelected ? 'text-slate-900' : 'text-slate-700'} truncate`}>
                              {staff.firstName} {staff.lastName}
                            </p>
                            <p className="text-xs text-slate-400 capitalize truncate mt-0.5">
                              {staff.role.replace('_', ' ').toLowerCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-[13px] text-slate-600 capitalize">
                         {/* Map role to a "Department" concept as in UI design */}
                         {staff.role === 'HEAD_NURSE' ? 'Medical' : staff.role === 'COORDINATOR' ? 'Operations' : 'Caregiving'}
                      </td>
                      <td className="py-3 px-2 text-[13px] text-slate-600">
                         {staff.phone || '(No Number)'}
                      </td>
                      <td className="py-3 px-2">
                         <StatusDot status={(staff as any).status || 'ACTIVE'} />
                      </td>
                      <td className="py-3 px-2 text-right">
                         <button className="text-slate-300 hover:text-slate-600 p-1">
                           <MoreVertical className="w-5 h-5" />
                         </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* =========================================
          RIGHT PROFILE SIDEBAR (Detail View)
          ========================================= */}
      <div className="w-[340px] flex flex-col bg-white shrink-0 overflow-y-auto">
        {selectedCaregiver ? (
          <div className="flex flex-col h-full">
            {/* Top Identity Area */}
            <div className="pt-10 pb-6 px-8 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-3xl font-bold text-slate-500 mb-4 overflow-hidden shadow-sm">
                 {selectedCaregiver.firstName?.charAt(0)}{selectedCaregiver.lastName?.charAt(0)}
              </div>
              <h2 className="text-[22px] font-normal text-slate-800 mb-1">
                {selectedCaregiver.firstName} {selectedCaregiver.lastName}
              </h2>
              <p className="text-[13px] text-slate-400 mb-4 capitalize">
                {selectedCaregiver.role.replace('_', ' ').toLowerCase()}
              </p>
              <StatusDot status={(selectedCaregiver as any).status || 'ACTIVE'} />
            </div>

            <div className="w-[85%] h-px bg-slate-100 mx-auto" />

            {/* Detail Sections */}
            <div className="flex-1 px-8 py-6 space-y-8">
              
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 text-center mb-5">Contact Information</h3>
                
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-400 font-medium">Office Tel:</span>
                  <span className="text-slate-600 text-right">N/A</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-400 font-medium">Mobile:</span>
                  <span className="text-slate-600 text-right">{selectedCaregiver.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-400 font-medium">Email:</span>
                  <span className="text-[#00c9c9] text-right truncate max-w-[150px]">{selectedCaregiver.email}</span>
                </div>

                <div className="flex justify-center gap-3 pt-3">
                  <button className="w-8 h-8 rounded-full bg-[#0077B5] text-white flex items-center justify-center hover:opacity-90"><span className="text-[10px] font-bold">in</span></button>
                  <button className="w-8 h-8 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90"><span className="text-[10px] font-bold">f</span></button>
                  <button className="w-8 h-8 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-90"><span className="text-[10px] font-bold">tw</span></button>
                  <button className="w-8 h-8 rounded-full bg-[#00aff0] text-white flex items-center justify-center hover:opacity-90"><span className="text-[10px] font-bold">sk</span></button>
                </div>
              </div>

              <div className="w-full h-px bg-slate-100" />

              {/* Work Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 text-center mb-5">Work Information</h3>
                
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-400 font-medium">Department:</span>
                  <span className="text-slate-600 text-right capitalize">
                    {selectedCaregiver.role === 'HEAD_NURSE' ? 'Medical' : selectedCaregiver.role === 'COORDINATOR' ? 'Operations' : 'Caregiving'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-400 font-medium">Supervisor:</span>
                  <span className="text-slate-600 text-right">System Admin</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-400 font-medium">Office:</span>
                  <span className="text-slate-600 text-right">{(selectedCaregiver as any).city || 'Helsinki'}</span>
                </div>
              </div>

              <div className="w-full h-px bg-slate-100" />

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 text-center mb-5">Personal Information</h3>
                
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-400 font-medium">Sex:</span>
                  <span className="text-slate-600 text-right">Not Specified</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-400 font-medium">Hire Date:</span>
                  <span className="text-slate-600 text-right">
                     {(selectedCaregiver as any).hireDate ? new Date((selectedCaregiver as any).hireDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-400 font-medium">City:</span>
                  <span className="text-slate-600 text-right">{(selectedCaregiver as any).city || 'Helsinki'}</span>
                </div>
              </div>

            </div>

            {/* Bottom Action Area */}
            <div className="p-5 border-t border-slate-100 mt-auto flex justify-center">
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="text-[13px] font-bold text-slate-700 hover:text-[#00c9c9] transition-colors"
              >
                View {selectedCaregiver.firstName}'s Full Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm p-8 text-center bg-slate-50/30">
            Select an employee from the directory to view their profile details.
          </div>
        )}
      </div>

    </div>
  );
}