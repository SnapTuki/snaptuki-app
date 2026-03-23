import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

import { AUTHENTICATE_USER } from '../graphql/mutations';
import { useAuthStore } from '../../../lib/store/authStore';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Work email is required'),
  password: Yup.string().required('Password is required'),
});

export function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); // Get the login action
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [authenticateUser, { loading }] = useMutation(AUTHENTICATE_USER, {
    onCompleted: (data) => {
      const { token, user } = data.authenticateUser;
      
      // Save to cookies and global state instantly
      login(user, token);
      navigate('/dashboard');
      
    },
    onError: (error) => {
      setServerError(error.message || 'Invalid email or password.');
    }
  });

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: LoginSchema,

    onSubmit: async (values) => {
      setServerError(null);
      await authenticateUser({ variables: {email: values.email, password: values.password} });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 w-full max-w-sm">
      {/* Error Alert */}
      {serverError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium leading-relaxed">{serverError}</p>
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <Mail className="w-5 h-5" />
          </div>
          <input
            type="email"
            {...formik.getFieldProps('email')}
            className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${
              formik.touched.email && formik.errors.email ? 'border-red-300' : 'border-slate-200 focus:border-blue-600'
            }`}
            placeholder="name@snaptuki.care"
            disabled={loading}
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <Lock className="w-5 h-5" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            {...formik.getFieldProps('password')}
            className={`block w-full pl-11 pr-12 py-3.5 bg-slate-50 border rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${
              formik.touched.password && formik.errors.password ? 'border-red-300' : 'border-slate-200 focus:border-blue-600'
            }`}
            placeholder="••••••••"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:pointer-events-none mt-4"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Access Portal <ArrowRight className="w-5 h-5" /></>}
      </button>
    </form>
  );
}