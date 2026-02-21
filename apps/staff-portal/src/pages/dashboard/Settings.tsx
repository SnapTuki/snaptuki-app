import React, { useState } from 'react';
import { 
  Globe, 
  Moon, 
  Bell, 
  ShieldCheck, 
  Monitor, 
  Check,
  Languages,
  Clock,
  User,
  Building,
  Lock,
  Mail,
  Smartphone
} from 'lucide-react';

/**
 * --- HELPER COMPONENTS ---
 */

// Reusable Toggle Switch Component
function Toggle({ label, description, checked, onChange }: { label: string, description: string, checked: boolean, onChange: (val: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-4 group">
      <div className="pr-8">
        <p className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">{description}</p>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`
          w-12 h-7 rounded-full p-1 transition-colors duration-300 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shrink-0
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

// Reusable Section Card
function Section({ icon: Icon, title, description, children }: { icon: any, title: string, description?: string, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm mb-6 transition-all hover:shadow-md">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-start gap-4">
        <div className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm text-blue-600 shrink-0 mt-0.5">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">{title}</h3>
          {description && <p className="text-sm text-slate-500 font-medium mt-1">{description}</p>}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

/**
 * --- MAIN PAGE COMPONENT ---
 */
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
    dataSharing: false,
  });

  const [language, setLanguage] = useState('en');

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Portal Settings</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your account, preferences, and security configurations.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm">
            Discard
          </button>
          <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 text-sm">
            Save Changes
          </button>
        </div>
      </div>

      {/* 1. Account Profile */}
      <Section icon={User} title="My Profile" description="Update your personal information and contact details.">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="shrink-0 flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border-4 border-white shadow-md flex items-center justify-center text-3xl font-black text-blue-600">
              SM
            </div>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
              Change Photo
            </button>
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
              <input type="text" defaultValue="Sarah Miller" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm text-slate-900" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Role / Title</label>
              <input type="text" defaultValue="Head Nurse" disabled className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium text-sm text-slate-500 cursor-not-allowed" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input type="email" defaultValue="sarah.m@snaptuki.care" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm text-slate-900" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
              <div className="relative">
                <Smartphone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input type="text" defaultValue="+358 40 123 4567" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm text-slate-900" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 2. General & Localization */}
      <Section icon={Languages} title="Localization & Region" description="Configure language and time settings for your dashboard.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Portal Language</label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none font-medium text-slate-700 transition-all"
              >
                <option value="en">English (US)</option>
                <option value="fi">Suomi (Finnish)</option>
                <option value="sv">Svenska (Swedish)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Timezone</label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
              <select className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none font-medium text-slate-700 transition-all">
                <option value="utc+2">Eastern European Time (EET / Helsinki)</option>
                <option value="utc+1">Central European Time (CET)</option>
                <option value="utc+0">Greenwich Mean Time (GMT)</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. Visual Preferences */}
      <Section icon={Monitor} title="Appearance & Interface" description="Customize how Snaptuki looks on your device.">
        <div className="divide-y divide-slate-100">
          <Toggle 
            label="Dark Mode" 
            description="Reduce eye strain during night shifts by switching to a darker color palette."
            checked={settings.darkMode} 
            onChange={() => handleToggle('darkMode')} 
          />
          <Toggle 
            label="Compact Density" 
            description="Show more rows in shift rosters and resident lists by reducing padding."
            checked={settings.compactMode} 
            onChange={() => handleToggle('compactMode')} 
          />
        </div>
      </Section>

      {/* 4. Notifications */}
      <Section icon={Bell} title="Notifications & Alerts" description="Control how and when you receive updates.">
        <div className="space-y-4 mb-4">
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
            <Check className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-800 font-medium leading-relaxed">
              <strong>Mandatory Alerts:</strong> Critical health alerts (e.g., patient fall detection, missed critical medication) are always enabled for on-duty staff and cannot be turned off.
            </p>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100">
          <Toggle 
            label="Email Summaries" 
            description="Receive daily shift handover reports and task summaries via email."
            checked={settings.emailAlerts} 
            onChange={() => handleToggle('emailAlerts')} 
          />
          <Toggle 
            label="SMS Alerts" 
            description="Receive text messages for urgent staffing requests or immediate shift changes."
            checked={settings.smsAlerts} 
            onChange={() => handleToggle('smsAlerts')} 
          />
          <Toggle 
            label="Push Notifications" 
            description="Real-time browser notifications for new task assignments and messages."
            checked={settings.pushNotifs} 
            onChange={() => handleToggle('pushNotifs')} 
          />
        </div>
      </Section>

      {/* 5. Security */}
      <Section icon={ShieldCheck} title="Security & Compliance" description="Manage access to your account and health data privacy.">
        <div className="divide-y divide-slate-100">
          <Toggle 
            label="Two-Factor Authentication (2FA)" 
            description="Require a secondary code when logging in from a new or unrecognized device."
            checked={settings.mfaEnabled} 
            onChange={() => handleToggle('mfaEnabled')} 
          />
          <Toggle 
            label="HIPAA Auto-Logout" 
            description="Automatically log out of the portal after 15 minutes of inactivity."
            checked={settings.autoLogout} 
            onChange={() => handleToggle('autoLogout')} 
          />
          <Toggle 
            label="Analytics Data Sharing" 
            description="Share anonymous usage data to help improve Snaptuki's performance."
            checked={settings.dataSharing} 
            onChange={() => handleToggle('dataSharing')} 
          />
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-sm font-bold transition-colors">
              <Lock className="w-4 h-4" /> Change Password
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-sm font-bold transition-colors">
              <Monitor className="w-4 h-4" /> View Active Sessions
            </button>
        </div>
      </Section>

      <div className="text-center pb-8">
        <p className="text-sm font-bold text-slate-400">Snaptuki Staff Portal v2.4.0 • Helsinki Region</p>
      </div>

    </div>
  );
}