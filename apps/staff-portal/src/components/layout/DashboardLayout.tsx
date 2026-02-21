import { Outlet } from 'react-router-dom';
import { Sidebar } from '../ui/Sidebar';
export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Left Sidebar (Hidden on mobile, block on large screens) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile Header (Only visible on small screens) */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <span className="text-xl font-extrabold text-blue-600">Snaptuki</span>
          {/* You can add a mobile hamburger menu button here later */}
        </header>

        {/* Page Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            {/* This <Outlet /> is where your Caregivers, Overview, and Residents pages will render */}
            <Outlet />
          </div>
        </div>
        
      </main>

    </div>
  );
}