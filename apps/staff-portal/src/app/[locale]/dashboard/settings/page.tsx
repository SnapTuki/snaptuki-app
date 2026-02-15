"use client";

import React, { useState } from 'react';
import { 
  Globe, 
  Moon, 
  Bell, 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  Monitor, 
  Check,
  Languages,
  Clock,
  Layout
} from 'lucide-react';

/**
 * Reusable Toggle Switch Component
 */
function Toggle({ label, description, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="pr-8">
        <p className="font-bold text-slate-900 text-sm">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">{description}</p>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`
          w-12 h-7 rounded-full p-1 transition-colors duration-300 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${checked ? 'bg-blue-600' : 'bg-slate-200'}
        `}
      >
        <div className={`
          w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `} />
      </button>
    </div>
  );
}

/**
 * Reusable Section Card
 */
function Section({ icon: Icon, title, children }: any) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm mb-6">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm text-blue-600">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  // State for toggles
  const [settings, setSettings] = useState({
    darkMode: false,
    compactMode: false,
    emailAlerts: true,
    smsAlerts: false,
    pushNotifs: true,
    mfaEnabled: true,
    autoLogout: true,
  });

  const [language, setLanguage] = useState('en');

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Portal Settings</h1>
        <p className="text-slate-500 font-medium">Manage preferences, notifications, and security configurations.</p>
      </div>

      {/* 1. General & Localization */}
      <Section icon={Languages} title="Localization & Region">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Portal Language</label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none font-medium"
              >
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="tl">Tagalog</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Timezone</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <select className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none font-medium">
                <option value="utc-5">Eastern Time (UTC-05:00)</option>
                <option value="utc-8">Pacific Time (UTC-08:00)</option>
                <option value="utc+0">GMT (UTC+00:00)</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      {/* 2. Visual Preferences */}
      <Section icon={Monitor} title="Appearance & Interface">
        <div className="divide-y divide-slate-100">
          <Toggle 
            label="Dark Mode" 
            description="Reduce eye strain during night shifts."
            checked={settings.darkMode} 
            onChange={() => handleToggle('darkMode')} 
          />
          <Toggle 
            label="Compact Density" 
            description="Show more rows in shift rosters and patient lists."
            checked={settings.compactMode} 
            onChange={() => handleToggle('compactMode')} 
          />
        </div>
      </Section>

      {/* 3. Notifications */}
      <Section icon={Bell} title="Notifications & Alerts">
        <div className="space-y-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
            <Check className="w-5 h-5 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800 font-medium">
              Critical health alerts (e.g., patient fall detection) are <strong>always enabled</strong> and cannot be turned off.
            </p>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100">
          <Toggle 
            label="Email Summaries" 
            description="Receive daily shift handover reports via email."
            checked={settings.emailAlerts} 
            onChange={() => handleToggle('emailAlerts')} 
          />
          <Toggle 
            label="SMS Alerts" 
            description="Receive text messages for urgent staffing requests."
            checked={settings.smsAlerts} 
            onChange={() => handleToggle('smsAlerts')} 
          />
          <Toggle 
            label="Push Notifications" 
            description="Real-time updates for task assignments."
            checked={settings.pushNotifs} 
            onChange={() => handleToggle('pushNotifs')} 
          />
        </div>
      </Section>

      {/* 4. Security */}
      <Section icon={ShieldCheck} title="Security & Compliance">
        <div className="divide-y divide-slate-100">
          <Toggle 
            label="Two-Factor Authentication (2FA)" 
            description="Require a code when logging in from a new device."
            checked={settings.mfaEnabled} 
            onChange={() => handleToggle('mfaEnabled')} 
          />
          <Toggle 
            label="Auto-Logout" 
            description="Automatically log out after 15 minutes of inactivity (HIPAA)."
            checked={settings.autoLogout} 
            onChange={() => handleToggle('autoLogout')} 
          />
        </div>
        <div className="mt-6 pt-6 border-t border-slate-100">
            <button className="text-sm font-bold text-blue-600 hover:underline">Change Password</button>
            <span className="mx-2 text-slate-300">|</span>
            <button className="text-sm font-bold text-blue-600 hover:underline">View Active Sessions</button>
        </div>
      </Section>

      {/* Save Action */}
      <div className="flex justify-end pt-4">
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-slate-200 transition-all active:scale-95">
          Save Changes
        </button>
      </div>
    </div>
  );
}