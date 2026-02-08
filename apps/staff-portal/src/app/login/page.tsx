"use client";

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight,
  AlertCircle
} from "lucide-react";

/**
 * Validation Schema
 * Defines the rules for the login form using Yup.
 */
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Work email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

/**
 * LoginForm Component
 * Now powered by Formik for robust state management and validation.
 */
function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      
      try {
        // Here you would normally call your GraphQL mutation:
        // const { data } = await loginMutation({ variables: values });
        
        console.log('Form Values:', values);
        
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Handle successful login here (e.g., redirect)
      } catch (err) {
        setServerError('Invalid credentials. Please try again or contact support.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      {/* Server Error Message */}
      {serverError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="email">
          Work Email
        </label>
        <div className="relative group">
          <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
            formik.touched.email && formik.errors.email ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-600'
          }`}>
            <Mail className="w-5 h-5" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            placeholder="name@snaptuki.care"
            className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              formik.touched.email && formik.errors.email 
                ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-600'
            }`}
          />
        </div>
        {formik.touched.email && formik.errors.email ? (
          <div className="text-xs text-red-500 ml-1 font-medium">{formik.errors.email}</div>
        ) : null}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
          <label className="text-sm font-semibold text-slate-700" htmlFor="password">
            Password
          </label>
          <button type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
            Forgot password?
          </button>
        </div>
        <div className="relative group">
          <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
            formik.touched.password && formik.errors.password ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-600'
          }`}>
            <Lock className="w-5 h-5" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            placeholder="••••••••"
            className={`block w-full pl-11 pr-12 py-3.5 bg-slate-50 border rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              formik.touched.password && formik.errors.password 
                ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-600'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {formik.touched.password && formik.errors.password ? (
          <div className="text-xs text-red-500 ml-1 font-medium">{formik.errors.password}</div>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
      >
        {formik.isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Login to Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-slate-100"></div>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Secured Portal</span>
        <div className="h-px flex-1 bg-slate-100"></div>
      </div>
    </form>
  );
}

/**
 * Main Login Page
 * Combines branding and the Formik-powered login form.
 */
export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Left Side: Brand & Visual */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Snaptuki</span>
          </div>
          
          <div>
            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              Care Management <br /> Simplified.
            </h1>
            <p className="text-blue-100 text-lg max-w-sm">
              Access your caregiver dashboard, manage shifts, and monitor patient care metrics in real-time.
            </p>
          </div>

          <div className="text-sm text-blue-200">
            &copy; 2026 Snaptuki Care Systems. All rights reserved.
          </div>
        </div>

        {/* Right Side: Login Form Area */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Staff Portal</h2>
            <p className="text-slate-500">Please enter your credentials to continue</p>
          </div>
          
          <LoginForm />
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center md:text-left">
            <p className="text-sm text-slate-400">
              Technical issues? <button className="text-blue-600 font-medium hover:underline">Contact Support</button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}