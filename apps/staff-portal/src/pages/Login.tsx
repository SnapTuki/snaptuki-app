import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldPlus, Heart, Activity, ShieldCheck } from 'lucide-react';
import { LoginForm } from '../features/auth/components/LoginForm';

export function Login() {
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('snaptuki_token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Left Column: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 lg:p-24">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[100px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/30">
              <ShieldPlus className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-extrabold text-white tracking-tight">Snaptuki</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            Empowering Caregivers, <br />
            <span className="text-blue-400">Elevating Care.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-md leading-relaxed font-medium">
            Securely manage patient vitals, coordinate shifts, and ensure the highest standard of elder care from a single centralized platform.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-6 text-sm font-bold text-slate-300">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-400" /> Vitals Sync
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" /> Real-time Tasks
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" /> HIPAA / GDPR
          </div>
        </div>
      </div>

      {/* Right Column: Form Assembly */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative bg-slate-50/50 lg:bg-white">
        
        {/* Mobile Header (Only visible on small screens) */}
        <div className="lg:hidden flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/30">
            <ShieldPlus className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Snaptuki</span>
        </div>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome back</h2>
          <p className="text-slate-500 font-medium mb-10">
            Please enter your staff credentials to access the secure portal.
          </p>

          {/* Import the isolated Feature Component */}
          <LoginForm />
          
        </div>

        <div className="mt-16 text-center lg:text-left text-sm font-semibold text-slate-400 max-w-md mx-auto lg:mx-0">
          <p>Authorized personnel only. Need help accessing your account? <a href="#" className="text-blue-600 hover:underline">Contact IT Support.</a></p>
        </div>
      </div>

    </div>
  );
}