import { NavLink, useNavigate } from 'react-router-dom';
import { 
  InboxIcon, 
  Users, 
  HeartPulse, 
  ClipboardCheck, 
  Settings, 
  LogOut,
  ShieldPlus
} from 'lucide-react';
import { useAuthStore } from '../../lib/store/authStore';
import { type TypedDocumentNode, gql } from '@apollo/client';
import type { Query } from '../../lib/graphql/generated';
import { useQuery } from '@apollo/client/react';
// Define the navigation links
const NAV_ITEMS = [
  { path: '/dashboard', label: 'Inbox', icon: InboxIcon, exact: true },
  { path: '/dashboard/residents', label: 'Residents', icon: HeartPulse },
  { path: '/dashboard/caregivers', label: 'Caregivers', icon: Users },
  { path: '/dashboard/tasks', label: 'Task Center', icon: ClipboardCheck },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export const GET_STAFF_NAME: TypedDocumentNode<Query> = gql`
  query GetStaffName($id: String!) {
    caregiverById(id: $id) {
      firstName
      lastName
      role
    }
  }
`;


export function Sidebar() {
  const navigate = useNavigate();
  // Pull user data and logout function from our Zustand store
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };
   // 2. Execute the GQL Query
  const { data} = useQuery(GET_STAFF_NAME, {
      variables: { id: user?.userId || '' },
      skip: !user?.userId, // Prevent fetching if user isn't loaded yet
      fetchPolicy: 'cache-and-network',
    });
  

  // Fallback initials if no profile photo exists
  const initials = user ? `${data?.caregiverById?.firstName.charAt(0)}${data?.caregiverById?.lastName.charAt(0)}` : 'ST';

  return (
    <aside className="w-72 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col shadow-sm">
      
      {/* 1. Brand Header */}
      <div className="h-20 flex items-center px-8 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 p-1.5 rounded-xl shadow-md shadow-blue-600/20">
            <ShieldPlus className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Snaptuki</span>
        </div>
      </div>

      {/* 2. Staff Profile View (Top) */}
      <div className="px-6 py-8 flex flex-col items-center border-b border-slate-100 bg-slate-50/50">
        <div className="relative mb-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
            {/* If user had an image URL, you'd use an <img src={user.imageUrl} /> here. Using initials fallback: */}
            <span className="text-2xl font-black text-blue-600 tracking-tight">
              {initials}
            </span>
          </div>
          {/* Online Status Indicator */}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
        </div>
        
        <h2 className="text-lg font-bold text-slate-900 text-center leading-tight">
          {user ? `${data?.caregiverById?.firstName} ${data?.caregiverById?.lastName}` : 'Staff Member'}
        </h2>
        <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mt-1.5">
          {user?.roles?.at(0) || 'Care Coordinator'}
        </p>
      </div>

      {/* 3. Navigation Links (Middle) */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200
              ${isActive 
                ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/50' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 4. Logout Button (Bottom) */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 hover:shadow-sm transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
          Secure Logout
        </button>
      </div>

    </aside>
  );
}