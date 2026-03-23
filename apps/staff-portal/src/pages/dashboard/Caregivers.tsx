import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
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
  RefreshCw
} from "lucide-react";

// --- GRAPHQL OPERATIONS ---
import { GET_CAREGIVERS } from '../../features/caregivers/graphql/queries';
import type { CaregiverType } from '../../lib/graphql/generated';
import { CaregiverRole, CaregiverStatus } from '../../lib/graphql/generated';
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
    'AVAILABLE': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'ON_JOB': 'bg-blue-50 text-blue-700 border-blue-200',
    'BUSY': 'bg-amber-50 text-amber-700 border-amber-200',
    'OFFLINE': 'bg-slate-50 text-slate-500 border-slate-200',
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[normalized] || styles['OFFLINE']}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

interface CaregiverFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  city: string;
  employmentType: string;
  hireDate: string;
  password: string; // The form needs this, even if the API type doesn't!
}
// --- INTERNAL COMPONENT: CAREGIVER FORM ---
interface CaregiverFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: CaregiverType | null;
  refetch: () => void;
}

function CaregiverForm({ isOpen, onClose, initialValues, refetch }: CaregiverFormProps) {
 const isEditMode = !!initialValues;
  
  const [registerCaregiver] = useMutation(REGISTER_CAREGIVER);
  const [updateCaregiverContact] = useMutation(UPDATE_CAREGIVER);

  const CaregiverSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too short').required('Required'),
    lastName: Yup.string().min(2, 'Too short').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phone: Yup.string().required('Required'),
    city: Yup.string().required('Required'), // Added city to schema
    role: Yup.string().required('Required'),
    employmentType: Yup.string().required('Required'),
    hireDate: Yup.string().required('Required'),
    password: isEditMode ? Yup.string() : Yup.string().required('Password is required'), // Changed to 'password'
  });

  const formik = useFormik<CaregiverFormValues>({
    initialValues: {
      firstName: initialValues?.firstName || '',
      lastName: initialValues?.lastName || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
      city: (initialValues as any)?.city || '', // Added city to initialValues
      role: initialValues?.role || CaregiverRole.Caregiver,
      
      employmentType: (initialValues as any)?.employmentType || 'FULL_TIME',
      hireDate: (initialValues as any)?.hireDate 
        ? new Date((initialValues as any).hireDate).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0],
      
      // Changed to 'password' to match your JSX inputs
      password: '', 
    },
    enableReinitialize: true,
    validationSchema: CaregiverSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setStatus }) => {
      console.log("Formik running submit");
      try {
        if (isEditMode) {
          const payload: any = {
            email: values.email,
            phone: values.phone,
            city: values.city,
          };
          
          // Use 'password' from values
          if (values.password) {
            payload.passwordHash = values.password; // Map it for the backend
          }

          await updateCaregiverContact({
            variables: { input: payload }
          });
        } else {
          console.log("Registering");
          await registerCaregiver({
            variables: {
              input: {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phone: values.phone,
                role: values.role,
                passwordHash: values.password, // Map 'password' form state to 'passwordHash' API payload
                employmentType: values.employmentType,
                hireDate: new Date(values.hireDate).toISOString(),
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

  // Automatically generate a password when opening the drawer to add a NEW caregiver
  useEffect(() => {
    if (isOpen && !isEditMode) {
      formik.setFieldValue('password', generateSecurePassword());
    } else if (!isOpen) {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEditMode]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 border-l border-slate-200 flex flex-col">
        
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{isEditMode ? 'Edit Staff Profile' : 'New Caregiver'}</h2>
            <p className="text-xs text-slate-500">{isEditMode ? 'Update contact & employment details' : 'Register staff to Snaptuki'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {formik.status && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-md border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {formik.status}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  {...formik.getFieldProps('firstName')}
                  disabled={isEditMode}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
                  placeholder="Sarah"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
              <input
                {...formik.getFieldProps('lastName')}
                disabled={isEditMode}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
                placeholder="Miller"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                {...formik.getFieldProps('email')}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                placeholder="staff@snaptuki.care"
              />
            </div>
          </div>

          {/* Conditional Password Section */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isEditMode ? 'Account Access' : 'Temporary Password'}
            </label>
            
            {!isEditMode ? (
              // New Caregiver: Show auto-generated password
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  readOnly
                  {...formik.getFieldProps('password')}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-mono outline-none"
                  title="Copy this password to give to the caregiver"
                />
                <p className="text-[10px] text-slate-500 font-medium mt-1">Automatically generated. Please save securely.</p>
              </div>
            ) : (
              // Existing Caregiver: Show Reset Button OR the newly generated password
              <div>
                {!formik.values.password ? (
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue('password', generateSecurePassword())}
                    className="px-3 py-2 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reset Password
                  </button>
                ) : (
                  <div className="relative animate-in fade-in zoom-in-95 duration-200">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-rose-500" />
                    <input
                      type="text"
                      readOnly
                      {...formik.getFieldProps('password')}
                      className="w-full pl-9 pr-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700 font-mono outline-none"
                    />
                    <p className="text-[10px] text-rose-600 font-medium mt-1">New password generated. Will be applied on save.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  {...formik.getFieldProps('phone')}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="+358..."
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">City/Region</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  {...formik.getFieldProps('city')}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="Helsinki"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-2" />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Employment</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <select
                  {...formik.getFieldProps('employmentType')}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none text-slate-700"
                >
                  <option value="FULL_TIME">Full-Time</option>
                  <option value="PART_TIME">Part-Time</option>
                  <option value="CONTRACT">Contract</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hire Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  {...formik.getFieldProps('hireDate')}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-700"
                />
              </div>
              {formik.touched.hireDate && formik.errors.hireDate && (
                <p className="text-[10px] text-red-500 font-medium ml-1 mt-0.5">{formik.errors.hireDate as string}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role Assignment</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'HEAD_NURSE', label: 'Head Nurse', icon: Shield },
                { id: 'CAREGIVER', label: 'Caregiver', icon: User },
                { id: 'COORDINATOR', label: 'Coordinator', icon: Briefcase },
              ].map((role) => (
                <label 
                  key={role.id}
                  className={`
                    relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border cursor-pointer transition-all
                    ${formik.values.role === role.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}
                    ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <input type="radio" name="role" value={role.id} onChange={formik.handleChange} disabled={isEditMode} className="hidden" />
                  <role.icon className={`w-5 h-5 ${formik.values.role === role.id ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold">{role.label}</span>
                </label>
              ))}
            </div>
          </div>
        </form>

        <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 px-3 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button 
            type="button"
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting}
            className="flex-[2] py-2 px-3 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
          >
            {formik.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditMode ? 'Save Changes' : 'Register Profile'}
          </button>
        </div>
      </div>
    </>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function CaregiversPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<CaregiverType | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Queries & Mutations
  const { data, loading, error, refetch } = useQuery(GET_CAREGIVERS, {
    fetchPolicy: 'cache-and-network'
  });

  const [deactivateCaregiver] = useMutation(DEACTIVATE_CAREGIVER);

  const caregivers: CaregiverType[] = data?.caregiverList || [];

  // Stats
  const totalStaff = caregivers.length;
  const availableCount = caregivers.filter(c => c.status === CaregiverStatus.Active).length;
  const onJobCount = caregivers.filter(c => c.status === CaregiverStatus.Active).length;

  const handleEdit = (staff: CaregiverType) => {
    setEditingStaff(staff);
    setIsDrawerOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deactivate this staff member? They will lose access to the portal immediately.')) {
      try {
        await deactivateCaregiver({ variables: { id } });
        refetch();
      } catch (err) {
        alert('Failed to deactivate caregiver.');
      }
    }
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-12">
      
      <CaregiverForm 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        initialValues={editingStaff}
        refetch={refetch}
      />

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Caregiver Registry</h1>
          <p className="text-sm text-slate-500 mt-1">Manage staff roster, credentials, and real-time availability.</p>
        </div>
        <button 
          onClick={() => { setEditingStaff(null); setIsDrawerOpen(true); }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Add Caregiver
        </button>
      </div>

      {/* Stats & Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Search */}
        <div className="lg:col-span-8 bg-white p-1.5 rounded-lg border border-slate-200 flex shadow-sm">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, role, or city..." 
              className="w-full pl-9 pr-3 py-2 bg-transparent border-none outline-none text-slate-700 text-sm placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && refetch()}
            />
          </div>
          <button 
            onClick={() => refetch()}
            className="px-4 border-l border-slate-100 text-slate-500 hover:text-blue-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors rounded-r-md"
          >
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
        </div>

        {/* Mini Stats Group */}
        <div className="lg:col-span-4 grid grid-cols-3 gap-2">
          <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex flex-col justify-center shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total</p>
            <p className="text-lg font-bold text-slate-900 leading-none">{totalStaff}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 flex flex-col justify-center shadow-sm">
            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">Available</p>
            <p className="text-lg font-bold text-emerald-800 leading-none">{availableCount}</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 flex flex-col justify-center shadow-sm">
            <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-0.5">On Shift</p>
            <p className="text-lg font-bold text-blue-800 leading-none">{onJobCount}</p>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {loading && !data ? (
           <div className="py-16 flex flex-col items-center justify-center text-slate-400">
             <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-600" />
             <p className="text-sm font-medium">Fetching caregiver records...</p>
           </div>
        ) : error ? (
           <div className="py-10 px-6 flex items-center justify-center text-red-600 bg-red-50/50">
             <AlertCircle className="w-5 h-5 mr-2" />
             <p className="text-sm font-semibold">Error loading caregivers: {error.message}</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px] text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Caregiver Info</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {caregivers.length === 0 ? (
                   <tr>
                     <td colSpan={3} className="px-5 py-12 text-center">
                       <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3 border border-slate-100">
                         <UserX className="w-5 h-5 text-slate-400" />
                       </div>
                       <h3 className="text-sm font-bold text-slate-900 mb-1">No staff members found</h3>
                       <p className="text-xs text-slate-500">Try adjusting your search query or adding a new caregiver.</p>
                     </td>
                   </tr>
                ) : (
                  caregivers.map((staff) => (
                    <tr key={staff.id} className="group hover:bg-slate-50 transition-colors relative">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors shrink-0">
                            {staff.firstName?.charAt(0)}{staff.lastName?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                                {staff.firstName} {staff.lastName}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="capitalize font-medium text-slate-600">{staff.role?.toLowerCase().replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-5 py-3">
                        <StatusBadge status={staff.status} />
                      </td>
                      
                      <td className="px-5 py-3 text-right relative">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === staff.id ? null : staff.id)}
                          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-400 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Action Dropdown Menu */}
                        {activeMenuId === staff.id && (
                          <div className="absolute right-8 top-10 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                            <button 
                              onClick={() => handleEdit(staff)}
                              className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-400" /> Edit Profile
                            </button>
                            <div className="h-px bg-slate-100" />
                            <button 
                              onClick={() => handleDelete(staff.id)}
                              className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                            >
                              <UserX className="w-3.5 h-3.5 text-rose-500" /> Deactivate
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}