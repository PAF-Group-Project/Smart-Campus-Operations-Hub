import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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

// Resource pages
import { BrowseResourcesPage } from './pages/facilities/BrowseResourcesPage';
import { ResourceDetailPage } from './pages/facilities/ResourceDetailPage';

// Resource Admin pages
import { AdminResourceDashboardPage } from './pages/admin/AdminResourceDashboardPage';
import { ManageResourcesPage } from './pages/admin/ManageResourcesPage';
import { ResourceStatsPage } from './pages/admin/ResourceStatsPage';

// Placeholder Pages
const Bookings = () => <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">Bookings Placeholder</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
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
                    
                    {/* Resources — user-facing browse */}
                    <Route path="resources" element={<BrowseResourcesPage />} />
                    <Route path="resources/:id" element={<ResourceDetailPage />} />

                    {/* Resource Admin pages */}
                    <Route 
                      path="admin/dashboard" 
                      element={
                        <RoleGuard allowedRoles={['ADMIN']}>
                          <AdminResourceDashboardPage />
                        </RoleGuard>
                      } 
                    />
                    <Route 
                      path="admin/manage" 
                      element={
                        <RoleGuard allowedRoles={['ADMIN']}>
                          <ManageResourcesPage />
                        </RoleGuard>
                      } 
                    />
                    <Route 
                      path="admin/stats" 
                      element={
                        <RoleGuard allowedRoles={['ADMIN']}>
                          <ResourceStatsPage />
                        </RoleGuard>
                      } 
                    />

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
