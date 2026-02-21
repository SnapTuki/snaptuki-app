import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../lib/store/authStore';

export function RequireAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, but remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // Render the protected child components
}