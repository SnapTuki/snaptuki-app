import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Overview } from './pages/dashboard/Overview';
import Residents from './pages/dashboard/Residents';
import CaregiversPage from './pages/dashboard/Caregivers';
import TasksPage from './pages/dashboard/TaskCenter';
import SettingsPage from './pages/dashboard/Settings';
import { RequireAuth } from './features/auth/components/RequireAuth';


function App() {
  return (
       <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes Wrapper */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={ <Overview /> } />
              <Route path="caregivers" element={<CaregiversPage />} />
              <Route path="residents" element={<Residents />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;