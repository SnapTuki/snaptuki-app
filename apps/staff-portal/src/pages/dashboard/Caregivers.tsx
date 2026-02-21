import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Star, 
  CheckCircle2, 
  MapPin,
  ShieldCheck,
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Shield,
  Loader2,
  Save,
  Edit2,
  UserX
} from "lucide-react";

// --- TYPES ---
interface Caregiver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'head_caregiver' | 'caregiver' | 'assistant' | 'trainee';
  city: string;
  availabilityStatus: 'AVAILABLE' | 'ON_JOB' | 'BUSY' | 'OFFLINE';
  rating: number;
  completedJobsCount: number;
  verified: boolean;
}

// --- MOCK DATA ---
const MOCK_CAREGIVERS: Caregiver[] = [
  { id: '1', firstName: 'Sarah', lastName: 'Miller', email: 'sarah.m@snaptuki.care', phone: '+358 40 1234567', role: 'head_caregiver', city: 'Helsinki', availabilityStatus: 'AVAILABLE', rating: 4.9, completedJobsCount: 124, verified: true },
  { id: '2', firstName: 'Johan', lastName: 'Lindholm', email: 'johan.l@snaptuki.care', phone: '+358 50 9876543', role: 'caregiver', city: 'Espoo', availabilityStatus: 'ON_JOB', rating: 4.5, completedJobsCount: 89, verified: false },
  { id: '3', firstName: 'Emily', lastName: 'Chen', email: 'emily.c@snaptuki.care', phone: '+358 45 1122334', role: 'caregiver', city: 'Vantaa', availabilityStatus: 'OFFLINE', rating: 4.8, completedJobsCount: 215, verified: true },
  { id: '4', firstName: 'Marcus', lastName: 'Wright', email: 'marcus.w@snaptuki.care', phone: '+358 40 5556667', role: 'assistant', city: 'Helsinki', availabilityStatus: 'BUSY', rating: 3.9, completedJobsCount: 42, verified: true },
  { id: '5', firstName: 'Anna', lastName: 'Korhonen', email: 'anna.k@snaptuki.care', phone: '+358 50 4443332', role: 'trainee', city: 'Helsinki', availabilityStatus: 'AVAILABLE', rating: 4.2, completedJobsCount: 12, verified: false },
];

// --- HELPER COMPONENTS ---

function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toUpperCase() || 'OFFLINE';
  const styles: Record<string, string> = {
    'AVAILABLE': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'ON_JOB': 'bg-blue-100 text-blue-700 border-blue-200',
    'BUSY': 'bg-amber-100 text-amber-700 border-amber-200',
    'OFFLINE': 'bg-slate-100 text-slate-500 border-slate-200',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[normalized] || styles['OFFLINE']}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

function PerformanceBar({ rating }: { rating: number }) {
  const percentage = (rating / 5) * 100;
  const color = percentage >= 90 ? 'bg-emerald-500' : percentage >= 70 ? 'bg-blue-500' : 'bg-amber-500';
  
  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between text-[10px] font-bold text-slate-500">
        <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-slate-300 text-slate-300" /> RATING</span>
        <span>{rating.toFixed(1)} / 5.0</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

// --- INTERNAL COMPONENT: CAREGIVER FORM ---
const CaregiverSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'Too short').required('Required'),
  lastName: Yup.string().min(2, 'Too short').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string().required('Required'),
  role: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
});

interface CaregiverFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: Caregiver | null;
  onSubmit: (values: any) => void;
}

function CaregiverForm({ isOpen, onClose, initialValues, onSubmit }: CaregiverFormProps) {
  const isEditMode = !!initialValues;

  const formik = useFormik({
    initialValues: initialValues || {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'caregiver',
      city: '',
      availabilityStatus: 'OFFLINE',
      rating: 0,
      completedJobsCount: 0,
      verified: false,
    },
    enableReinitialize: true,
    validationSchema: CaregiverSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
      const payload = { ...values, id: initialValues?.id || Math.random().toString(36).substr(2, 9) };
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
        
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{isEditMode ? 'Edit Staff Profile' : 'New Caregiver'}</h2>
            <p className="text-sm text-slate-500">{isEditMode ? 'Update employment records' : 'Add staff to Snaptuki registry'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">First Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  {...formik.getFieldProps('firstName')}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="Sarah"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Last Name</label>
              <input
                {...formik.getFieldProps('lastName')}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="Miller"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                {...formik.getFieldProps('email')}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="staff@snaptuki.care"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  {...formik.getFieldProps('phone')}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="+358..."
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">City/Region</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  {...formik.getFieldProps('city')}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="Helsinki"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-4" />

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Role Assignment</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'head_caregiver', label: 'Head Nurse', icon: Shield },
                { id: 'caregiver', label: 'Caregiver', icon: User },
                { id: 'assistant', label: 'Assistant', icon: Briefcase },
                { id: 'trainee', label: 'Trainee', icon: CheckCircle2 },
              ].map((role) => (
                <label 
                  key={role.id}
                  className={`
                    relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${formik.values.role === role.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'}
                  `}
                >
                  <input type="radio" name="role" value={role.id} onChange={formik.handleChange} className="hidden" />
                  <role.icon className={`w-6 h-6 ${formik.values.role === role.id ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold">{role.label}</span>
                </label>
              ))}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button 
            type="button"
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting}
            className="flex-[2] py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {formik.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isEditMode ? 'Save Changes' : 'Create Profile'}
          </button>
        </div>
      </div>
    </>
  );
}

// --- MAIN PAGE COMPONENT ---
export function CaregiversPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Caregiver | null>(null);
  const [caregivers, setCaregivers] = useState<Caregiver[]>(MOCK_CAREGIVERS);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Stats
  const totalStaff = caregivers.length;
  const availableCount = caregivers.filter(c => c.availabilityStatus === 'AVAILABLE').length;
  const onJobCount = caregivers.filter(c => c.availabilityStatus === 'ON_JOB').length;

  const filteredCaregivers = caregivers.filter(staff => 
    `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
    staff.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().replace('_', ' ').includes(searchTerm.toLowerCase())
  );

  const handleEdit = (staff: Caregiver) => {
    setEditingStaff(staff);
    setIsDrawerOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deactivate this staff member?')) {
      setCaregivers(prev => prev.filter(c => c.id !== id));
    }
    setActiveMenuId(null);
  };

  const handleFormSubmit = (data: Caregiver) => {
    if (editingStaff) {
      setCaregivers(prev => prev.map(c => c.id === data.id ? data : c));
    } else {
      setCaregivers(prev => [data, ...prev]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Drawer */}
      <CaregiverForm 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        initialValues={editingStaff}
        onSubmit={handleFormSubmit}
      />

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Caregivers</h1>
          <p className="text-slate-500 font-medium mt-1">Manage staff roster, monitor performance, and availability.</p>
        </div>
        <button 
          onClick={() => { setEditingStaff(null); setIsDrawerOpen(true); }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Add Caregiver
        </button>
      </div>

      {/* Stats & Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Search */}
        <div className="lg:col-span-6 xl:col-span-8 bg-white p-2 rounded-2xl border border-slate-200 flex shadow-sm">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, role, or city..." 
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
            <p className="text-2xl font-black text-slate-900 leading-none">{totalStaff}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Available</p>
            <p className="text-2xl font-black text-emerald-700 leading-none">{availableCount}</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">On Shift</p>
            <p className="text-2xl font-black text-blue-700 leading-none">{onJobCount}</p>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-8 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Caregiver</th>
                <th className="px-8 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Performance</th>
                <th className="px-8 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Jobs Done</th>
                <th className="px-8 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCaregivers.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="px-8 py-16 text-center">
                     <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                       <UserX className="w-8 h-8 text-slate-300" />
                     </div>
                     <h3 className="text-lg font-bold text-slate-900 mb-1">No staff members found</h3>
                     <p className="text-slate-500 font-medium">Try adjusting your search terms.</p>
                   </td>
                 </tr>
              ) : (
                filteredCaregivers.map((staff) => (
                  <tr key={staff.id} className="group hover:bg-blue-50/30 transition-colors relative">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center font-black text-slate-600 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:text-blue-700 transition-colors shadow-sm">
                          {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-base">
                              {staff.firstName} {staff.lastName}
                            </p>
                            {staff.verified && <ShieldCheck className="w-4 h-4 text-blue-500" aria-label="Verified" />}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                            <span className="capitalize">{staff.role.replace('_', ' ')}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {staff.city}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-8 py-6">
                      <StatusBadge status={staff.availabilityStatus} />
                    </td>
                    
                    <td className="px-8 py-6 w-64">
                      <PerformanceBar rating={staff.rating} />
                    </td>
                    
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-700 text-base">{staff.completedJobsCount}</span>
                      </div>
                    </td>
                    
                    <td className="px-8 py-6 text-right relative">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === staff.id ? null : staff.id)}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {/* Action Dropdown Menu */}
                      {activeMenuId === staff.id && (
                        <div className="absolute right-8 top-14 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                          <button 
                            onClick={() => handleEdit(staff)}
                            className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-slate-400" /> Edit Profile
                          </button>
                          <div className="h-px bg-slate-100" />
                          <button 
                            onClick={() => handleDelete(staff.id)}
                            className="w-full px-4 py-3 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                          >
                            <UserX className="w-4 h-4 text-rose-500" /> Deactivate
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
      </div>
      
    </div>
  );
}

export default CaregiversPage;