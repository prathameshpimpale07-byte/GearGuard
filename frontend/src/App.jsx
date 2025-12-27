import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Navbar from './components/Layout/Navbar';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import UnauthorizedPage from './pages/Auth/UnauthorizedPage';
import SessionExpiredPage from './pages/Auth/SessionExpiredPage';

// Common Pages
import Dashboard from './pages/Common/Dashboard';

// Import other pages as we create them
// Equipment, Teams, Requests, Calendar, Admin, etc.

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
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
                      <Route path="/dashboard" element={<Dashboard />} />

                      {/* Equipment Routes */}
                      {/* <Route path="/equipment" element={<EquipmentListPage />} /> */}

                      {/* Request Routes */}
                      {/* <Route path="/requests" element={<KanbanBoardPage />} /> */}

                      {/* Calendar Routes */}
                      {/* <Route path="/calendar" element={<CalendarViewPage />} /> */}

                      {/* Team Routes */}
                      {/* <Route path="/teams" element={<TeamListPage />} /> */}

                      {/* Admin Routes */}
                      {/* <Route path="/admin" element={<AdminDashboard />} /> */}

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
