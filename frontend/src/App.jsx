import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Navbar from './components/Layout/Navbar';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import UnauthorizedPage from './pages/Auth/UnauthorizedPage';
import SessionExpiredPage from './pages/Auth/SessionExpiredPage';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Common Pages
import Dashboard from './pages/Common/Dashboard';
import Profile from './pages/Common/Profile';
import Notifications from './pages/Common/Notifications';
import GlobalSearch from './pages/Common/GlobalSearch';
import Help from './pages/Common/Help';

// Admin Pages
import AdminOverview from './pages/Admin/AdminOverview';
import UserManagement from './pages/Admin/UserManagement';
import CreateUser from './pages/Admin/CreateUser';
import EditUser from './pages/Admin/EditUser';
import RolePermissions from './pages/Admin/RolePermissions';
import SystemSettings from './pages/Admin/SystemSettings';
import AuditLog from './pages/Admin/AuditLog';
import ReportsDashboard from './pages/Reports/ReportsDashboard';
import TeamReports from './pages/Reports/TeamReports';
import EquipmentReports from './pages/Reports/EquipmentReports';
import FaultyEquipment from './pages/Reports/FaultyEquipment';

// Equipment Pages
import EquipmentList from './pages/Equipment/EquipmentList';
import CreateEquipment from './pages/Equipment/CreateEquipment';
import EquipmentDetail from './pages/Equipment/EquipmentDetail';
import EditEquipment from './pages/Equipment/EditEquipment';

// Team Pages
import TeamList from './pages/Team/TeamList';
import CreateTeam from './pages/Team/CreateTeam';
import TeamDetail from './pages/Team/TeamDetail';

// Maintenance Pages
import KanbanBoard from './pages/Maintenance/KanbanBoard';
import CreateRequest from './pages/Maintenance/CreateRequest';
import RequestDetail from './pages/Maintenance/RequestDetail';
import CalendarView from './pages/Maintenance/CalendarView';
import MyAssignedRequests from './pages/Maintenance/MyAssignedRequests';
import MyRaisedRequests from './pages/Maintenance/MyRaisedRequests';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/session-expired" element={<SessionExpiredPage />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      {/* Common */}
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/search" element={<GlobalSearch />} />
                      <Route path="/help" element={<Help />} />

                      {/* Equipment */}
                      <Route path="/equipment" element={<EquipmentList />} />
                      <Route path="/equipment/create" element={<CreateEquipment />} />
                      <Route path="/equipment/:id" element={<EquipmentDetail />} />
                      <Route path="/equipment/:id/edit" element={<EditEquipment />} />

                      {/* Maintenance Requests */}
                      <Route path="/maintenance" element={<KanbanBoard />} />
                      <Route path="/maintenance/create" element={<CreateRequest />} />
                      <Route path="/maintenance/:id" element={<RequestDetail />} />
                      <Route path="/maintenance/calendar" element={<CalendarView />} />
                      <Route path="/maintenance/my-assigned" element={<MyAssignedRequests />} />
                      <Route path="/maintenance/my-raised" element={<MyRaisedRequests />} />

                      {/* Teams */}
                      <Route path="/teams" element={<TeamList />} />
                      <Route path="/teams/create" element={<CreateTeam />} />
                      <Route path="/teams/:id" element={<TeamDetail />} />

                      {/* Admin */}
                      <Route path="/admin" element={<AdminOverview />} />
                      <Route path="/admin/users" element={<UserManagement />} />
                      <Route path="/admin/users/create" element={<CreateUser />} />
                      <Route path="/admin/users/:id" element={<EditUser />} />
                      <Route path="/admin/roles" element={<RolePermissions />} />
                      <Route path="/admin/settings" element={<SystemSettings />} />
                      <Route path="/admin/audit-logs" element={<AuditLog />} />

                      {/* Reports */}
                      <Route path="/reports" element={<ReportsDashboard />} />
                      <Route path="/reports/team" element={<TeamReports />} />
                      <Route path="/reports/equipment" element={<EquipmentReports />} />
                      <Route path="/reports/faulty" element={<FaultyEquipment />} />

                      {/* Default redirect */}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="*" element={<div>404 - Page Not Found</div>} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
