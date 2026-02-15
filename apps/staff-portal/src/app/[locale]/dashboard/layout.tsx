"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// import { useTranslations } from 'next-intl'; // Uncomment this in production
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CheckSquare, 
  UserCircle, 
  Settings, 
  Bell, 
  Search,
  Menu,
  LogOut,
  ShieldPlus,
  SlidersHorizontal
} from "lucide-react";

// --- INTERNAL TRANSLATION DICTIONARIES ---
// This ensures the preview works immediately even if the JSON files aren't loaded yet.
const DICTIONARIES: Record<string, Record<string, string>> = {
  en: {
    overview: 'Overview',
    caregivers: 'Caregivers',
    residents: 'Residents',
    shifts: 'Shift Roster',
    tasks: 'Tasks',
    settings: 'Portal Settings',
    logout: 'Logout'
  },
  fi: {
    overview: 'Yleiskatsaus',
    caregivers: 'Hoitajat',
    patients: 'Asukkaat',
    shifts: 'Työvuorot',
    tasks: 'Tehtävät',
    settings: 'Asetukset',
    logout: 'Kirjaudu ulos'
  },
  sv: {
    overview: 'Översikt',
    caregivers: 'Vårdare',
    patients: 'Boende',
    shifts: 'Arbetsskift',
    tasks: 'Uppgifter',
    settings: 'Inställningar',
    logout: 'Logga ut'
  }
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState('/dashboard');
  const [currentLocale, setCurrentLocale] = useState('en');

  // 1. Detect Language from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      setActivePath(path);
      
      // Split "/fi/dashboard" -> ["", "fi", "dashboard"]
      const segments = path.split('/');
      const foundLocale = segments[1];
      
      if (['en', 'fi', 'sv'].includes(foundLocale)) {
        setCurrentLocale(foundLocale);
      }
    }
  }, []);

  // 2. Helper to get translation for current locale
  const t = (key: string) => {
    const dict = DICTIONARIES[currentLocale] || DICTIONARIES['en'];
    return dict[key] || key;
  };

  const navigation = [
    { name: t('overview'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('caregivers'), href: '/dashboard/caregivers', icon: UserCircle },
    { name: t('residents'), href: '/dashboard/residents', icon: Users },
    { name: t('shifts'), href: '/dashboard/shifts', icon: Calendar },
    { name: t('tasks'), href: '/dashboard/tasks', icon: CheckSquare },
    { name: t('settings'), href: '/dashboard/settings', icon: SlidersHorizontal },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* FIXED SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Brand Logo Section */}
          <div className="p-6 border-b border-slate-50 h-20 flex items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
                <ShieldPlus className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Snaptuki</span>
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              // Construct localized path
              const localizedHref = `/${currentLocale}${item.href === '/dashboard' ? '/dashboard' : item.href}`;
              
              const isActive = activePath === localizedHref;
              
              return (
             
                <Link href={localizedHref} key={item.href}  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-semibold
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                  `}>
                    <item.icon 
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} 
                  />
                <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group">
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">{t('logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">
        
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-2xl w-80 group focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Find..." 
                className="bg-transparent border-none focus:outline-none ml-3 text-sm w-full text-slate-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher (Simple visual for preview) */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg p-1 text-xs font-bold">
               {['en', 'fi', 'sv'].map(lang => (
                 <a 
                   key={lang}
                   href={`/${lang}/dashboard`} // Hard reload to switch language
                   className={`px-2 py-1 rounded-md uppercase ${currentLocale === lang ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {lang}
                 </a>
               ))}
            </div>

            <button className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 relative group transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none mb-1">Admin Staff</p>
                <p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Manager Role</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-100 border border-white shadow-sm flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Viewport */}
        <main className="p-4 lg:p-6 w-full flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}