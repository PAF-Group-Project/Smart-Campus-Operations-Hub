import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/protected/ProtectedRoute';
import RoleGuard from './components/protected/RoleGuard';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import UserManagementPage from './pages/UserManagementPage';
import NotificationsPage from './pages/NotificationsPage';
import DashboardPage from './pages/DashboardPage';
import NotificationPreferencesPage from './pages/NotificationPreferencesPage';

// Feature Pages
import { ResourceListPage } from './pages/facilities/ResourceListPage';
import { ResourceDetailPage } from './pages/facilities/ResourceDetailPage';

// Placeholder Pages
const Bookings = () => <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">Bookings Placeholder</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="facilities" element={<ResourceListPage />} />
                    <Route path="facilities/:id" element={<ResourceDetailPage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="settings/notifications" element={<NotificationPreferencesPage />} />

                    <Route 
                      path="users" 
                      element={
                        <RoleGuard allowedRoles={['ADMIN']}>
                          <UserManagementPage />
                        </RoleGuard>
                      } 
                    />

                    <Route path="bookings" element={<Bookings />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
