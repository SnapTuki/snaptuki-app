import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MapPin,
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Shield,
  Loader2,
  Save,
  Edit2,
  UserX,
  AlertCircle,
  Lock,
  Calendar,
  Award,
  GraduationCap,
  Activity,
  Users,
  ChevronDown
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
function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toUpperCase() || 'OFFLINE';
  const styles: Record<string, string> = {
    'ACTIVE': 'text-emerald-700 bg-emerald-50 border-emerald-200 shadow-sm shadow-emerald-100',
    'IN_ACTIVE': 'text-slate-700 bg-slate-50 border-slate-200 shadow-sm shadow-slate-100',
    'SUSPENDED': 'text-rose-700 bg-rose-50 border-rose-200 shadow-sm shadow-rose-100',
  };

  return (
    <span className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-widest border flex items-center gap-1.5 w-fit ${styles[normalized] || styles['IN_ACTIVE']}`}>
       <Activity className="w-3.5 h-3.5" /> {status?.replace('_', ' ')}
    </span>
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
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="Sarah"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Last Name</label>
              <input
                {...formik.getFieldProps('lastName')}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
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
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
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
                title="Copy this password to give to the caregiver"
              />
              <p className="text-[10px] text-slate-500 font-medium mt-1 ml-1">Automatically generated. Please save securely.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  {...formik.getFieldProps('phone')}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
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
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
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
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none text-slate-700 font-medium"
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
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-700"
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
                    ${formik.values.role === role.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'}
                  `}
                >
                  <input type="radio" name="role" value={role.id} onChange={formik.handleChange} className="hidden" />
                  <role.icon className={`w-5 h-5 ${formik.values.role === role.id ? 'text-blue-600' : 'text-slate-400'}`} />
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
            className="flex-[2] py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
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
    if (confirm('Are you sure you want to deactivate this staff member? They will lose access immediately.')) {
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
          <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 ${
            caregiver.role === 'HEAD_NURSE' ? 'from-purple-500 to-indigo-500' :
            caregiver.role === 'COORDINATOR' ? 'from-emerald-500 to-teal-500' : 'from-blue-500 to-cyan-500'
          }`} />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-3xl font-black text-slate-400 shadow-sm">
              {caregiver.firstName?.charAt(0)}{caregiver.lastName?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 text-sm text-slate-500 mt-1.5 font-medium">
                <span className="flex items-center gap-1.5 capitalize text-slate-700 font-bold">
                  {caregiver.role === 'HEAD_NURSE' ? <Shield className="w-4 h-4 text-purple-600" /> : <Briefcase className="w-4 h-4 text-blue-600" />}
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
                  ? 'border-blue-600 text-blue-600' 
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
                    <input {...formik.getFieldProps('email')} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-slate-800 transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
                    <input {...formik.getFieldProps('phone')} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-slate-800 transition-colors" />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">City / Region</label>
                    <input {...formik.getFieldProps('city')} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-slate-800 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button type="button" onClick={handleDeactivate} className="px-4 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 flex items-center gap-2 transition-all">
                  <UserX className="w-4 h-4" /> Deactivate Staff
                </button>
                <button type="submit" disabled={formik.isSubmitting} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-[0.98]">
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
                  <div>
                   
                  </div>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Note: Core employment data (Role, Hire Date, Contract Type) must be modified by an administrator through the HR Portal context.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CERTIFICATIONS' && (
            <div className="max-w-3xl space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Verified Credentials</h3>
              </div>
              
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

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">First Aid & CPR / AED</h4>
                    <p className="text-sm text-slate-500 mt-0.5">Red Cross Finland</p>
                    <div className="flex gap-3 mt-3">
                       <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-1 rounded">Issued: 2023</span>
                       <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-1 rounded border border-emerald-200">Valid until 2026</span>
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modals
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState<StaffType | null>(null);

  // Queries
  const { data, loading, error, refetch } = useQuery(GET_CAREGIVERS, {
    fetchPolicy: 'cache-and-network'
  });

  const caregivers: StaffType[] = data?.caregiverList || [];

  // --- FILTER LOGIC ---
  const filteredCaregivers = caregivers.filter((staff) => {
    // 1. Text Search
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    const city = (staff as any).city?.toLowerCase() || '';
    const roleString = staff.role?.replace('_', ' ').toLowerCase() || '';
    
    const matchesSearch = !searchTerm || 
      fullName.includes(searchLower) ||
      staff.email?.toLowerCase().includes(searchLower) ||
      roleString.includes(searchLower) ||
      city.includes(searchLower);

    // 2. Role Filter
    const matchesRole = filterRole === 'ALL' || staff.role === filterRole;


    return matchesSearch && matchesRole;
  });

  const totalStaff = caregivers.length;
  const nurseCount = caregivers.filter(c => c.role === 'HEAD_NURSE').length;

  const handleCardClick = (staff: StaffType) => {
    setSelectedCaregiver(staff);
    setIsProfileModalOpen(true);
  };

  const handleDeactivate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to deactivate this staff member?')) {
        // Assume execution is handled here
        alert("Action triggered.");
    }
  };

  const clearFilters = () => {
    setFilterRole('ALL');
    setFilterStatus('ALL');
    setSearchTerm('');
  };

  return (
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
          FIXED HEADER AREA (Will never scroll)
          ========================================= */}
       <div className="shrink-0 flex flex-col gap-5 pb-4 pt-2 z-10 bg-slate-50/50 px-6 md:px-10">
          
          {/* Title & Primary Action */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Staff Directory</h1>
              <p className="text-slate-500 font-medium mt-1">Manage caregivers, coordinators, and medical personnel.</p>
            </div>
            <button 
              onClick={() => setIsAddDrawerOpen(true)}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Add Staff
            </button>
          </div>

          {/* Thin Boxed Stats */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-2.5 px-4 py-2 border border-slate-200 bg-white/60 rounded-xl shadow-sm">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                 <Users className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <span className="text-slate-500 font-medium">Total Staff: <strong className="text-slate-900 ml-0.5">{totalStaff}</strong></span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 border border-slate-200 bg-white/60 rounded-xl shadow-sm">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                 <Activity className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 border border-slate-200 bg-white/60 rounded-xl shadow-sm">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                 <Shield className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <span className="text-slate-500 font-medium">Head Nurses: <strong className="text-slate-900 ml-0.5">{nurseCount}</strong></span>
            </div>
          </div>

          {/* Controls: Search & Filter Button */}
          <div className="flex flex-col lg:flex-row items-center justify-end gap-4 mt-1">
            <div className="flex w-full lg:w-auto gap-3 items-center">
              <div className="relative group w-full lg:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search name, role, city..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 focus:border-blue-300 shadow-sm rounded-xl outline-none text-slate-700 font-medium placeholder:text-slate-400 text-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border shadow-sm transition-colors ${
                  isFilterOpen || filterRole !== 'ALL' || filterStatus !== 'ALL'
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Filter className="w-4 h-4" /> Filter
                {(filterRole !== 'ALL' || filterStatus !== 'ALL') && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 ml-1" />
                )}
              </button>
            </div>
          </div>

          {/* Inline Expandable Filter Panel */}
          {isFilterOpen && (
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-wrap gap-4 animate-in fade-in slide-in-from-top-2 duration-200 self-end">
              <div className="space-y-1.5 flex-1 min-w-[200px]">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role</label>
                <div className="relative">
                  <select 
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-blue-300 transition-colors appearance-none"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="HEAD_NURSE">Head Nurse</option>
                    <option value="CAREGIVER">Caregiver</option>
                    <option value="COORDINATOR">Coordinator</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5 flex-1 min-w-[200px]">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
                <div className="relative">
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-blue-300 transition-colors appearance-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="IN_ACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
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
          SCROLLABLE LIST AREA (Hidden Scrollbar)
          ========================================= */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-10 px-6 md:px-10">
        {loading && !data ? (
           <div className="py-20 flex flex-col items-center justify-center text-slate-400">
             <Loader2 className="w-8 h-8 animate-spin mb-4 text-slate-300" />
             <p className="text-sm font-bold text-slate-500">Loading directory...</p>
           </div>
        ) : error ? (
           <div className="py-8 px-6 flex items-center justify-center text-red-600 bg-red-50 rounded-2xl border border-red-200 mt-2">
             <AlertCircle className="w-5 h-5 mr-3" />
             <p className="text-sm font-bold">Error loading staff: {error.message}</p>
           </div>
        ) : (
          <>
            {filteredCaregivers.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white border border-slate-200 rounded-3xl mt-2">
                 <UserX className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                 <h3 className="text-base font-bold text-slate-900 mb-1">
                   {searchTerm || filterRole !== 'ALL' || filterStatus !== 'ALL' ? 'No matching staff found' : 'No staff members found'}
                 </h3>
                 <p className="text-sm text-slate-500 font-medium">
                   {searchTerm || filterRole !== 'ALL' || filterStatus !== 'ALL' ? 'Try adjusting your search or filter criteria.' : 'Add a new staff member to get started.'}
                 </p>
                 {(searchTerm || filterRole !== 'ALL' || filterStatus !== 'ALL') && (
                    <button onClick={clearFilters} className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-800">
                      Clear Filters
                    </button>
                  )}
              </div>
            ) : (
              /* CARD GRID LAYOUT (Innovated) */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-2">
                {filteredCaregivers.map((staff) => {

                  // Determine ambient glow color based on role
                  const glowColor = 
                    staff.role === 'HEAD_NURSE' ? 'bg-purple-400' : 
                    staff.role === 'COORDINATOR' ? 'bg-emerald-400' : 'bg-blue-400';

                  return (
                    <div 
                      key={staff.id} 
                      onClick={() => handleCardClick(staff)}
                      className="group bg-white rounded-[28px] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col relative cursor-pointer h-full justify-between"
                    >
                      {/* Innovative Background Glow */}
                      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2 transition-opacity group-hover:opacity-20 ${glowColor}`} />

                      <div className="p-6 flex flex-col flex-1 relative z-10">
                        
                        {/* Top Row: Avatar & Actions */}
                        <div className="flex justify-between items-start mb-5">
                          <div className="w-14 h-14 rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-center text-xl font-black text-slate-400 shadow-sm group-hover:bg-white group-hover:text-blue-600 transition-colors">
                            {staff.firstName?.charAt(0)}{staff.lastName?.charAt(0)}
                          </div>
                          
                          {/* Quick Actions (Hover Reveal - slides in smoothly) */}
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 duration-300">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedCaregiver(staff); setIsProfileModalOpen(true); }}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors bg-white border border-slate-100 shadow-sm"
                              title="Edit Profile"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => handleDeactivate(staff.id, e)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors bg-white border border-slate-100 shadow-sm"
                              title="Deactivate Caregiver"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Identity Info */}
                        <div className="mb-6">
                          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {staff.firstName} {staff.lastName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 capitalize">
                            {staff.role === 'HEAD_NURSE' ? <Shield className="w-4 h-4 text-purple-400" /> : <Briefcase className="w-4 h-4 text-blue-400" />}
                            {staff.role?.replace('_', ' ').toLowerCase()}
                          </div>
                        </div>

                        {/* Edge-to-Edge Data Ribbon */}
                        <div className="flex items-center justify-between py-4 border-y border-slate-100/80 mt-auto mb-5 bg-slate-50/50 -mx-6 px-6">
                           <div className="flex flex-col flex-1 min-w-0 pr-2">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Mail className="w-3 h-3"/> Email</span>
                             <span className="text-xs font-bold text-slate-700 truncate">{staff.email}</span>
                           </div>
                           <div className="w-px h-8 bg-slate-200/60" />
                           <div className="flex flex-col flex-1 min-w-0 px-2">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Phone className="w-3 h-3"/> Phone</span>
                             <span className="text-xs font-bold text-slate-700 truncate">{staff.phone || 'N/A'}</span>
                           </div>
                           <div className="w-px h-8 bg-slate-200/60" />
                           <div className="flex flex-col shrink-0 pl-2">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> City</span>
                             <span className="text-xs font-bold text-slate-700">{(staff as any).city || 'Helsinki'}</span>
                           </div>
                        </div>

                        {/* Footer: Badge & Detail Link */}
                        <div className="flex items-center justify-between">
                          
                          <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                            View Profile <ChevronDown className="w-3 h-3 -rotate-90" />
                          </span>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}