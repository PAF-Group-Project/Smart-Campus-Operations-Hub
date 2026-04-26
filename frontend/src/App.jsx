import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/protected/ProtectedRoute';
import RoleGuard from './components/protected/RoleGuard';
import { AuthProvider, useAuth } from './context/AuthContext';
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

// Ticket Module Pages
import StudentTicketList from './features/ticket/pages/StudentTicketList';
import StudentCreateTicket from './features/ticket/pages/StudentCreateTicket';
import StudentTicketDetails from './features/ticket/pages/StudentTicketDetails';
import AdminTicketDashboard from './features/ticket/pages/AdminTicketDashboard';
import AdminTicketDetails from './features/ticket/pages/AdminTicketDetails';
import TechnicianWorklist from './features/ticket/pages/TechnicianWorklist';
import TechnicianTicketDetails from './features/ticket/pages/TechnicianTicketDetails';

// Placeholder Pages
const Bookings = () => <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">Bookings Placeholder</div>;

// Role-based Redirect for Root
const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'ADMIN': return <Navigate to="/dashboard" replace />;
    case 'TECHNICIAN': return <Navigate to="/technician/tickets" replace />;
    case 'USER': return <Navigate to="/dashboard" replace />;
    default: return <Navigate to="/dashboard" replace />;
  }
};

// Role-based Redirect for Tickets
const TicketRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'ADMIN': return <Navigate to="/admin/tickets" replace />;
    case 'TECHNICIAN': return <Navigate to="/technician/tickets" replace />;
    case 'USER': return <Navigate to="/student/tickets" replace />;
    default: return <Navigate to="/dashboard" replace />;
  }
};

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

                    {/* Module C - Maintenance & Incident Ticketing */}
                    {/* Student Routes */}
                    <Route
                      path="student/tickets"
                      element={
                        <RoleGuard allowedRoles={['USER']}>
                          <StudentTicketList />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="student/tickets/new"
                      element={
                        <RoleGuard allowedRoles={['USER']}>
                          <StudentCreateTicket />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="student/tickets/:id"
                      element={
                        <RoleGuard allowedRoles={['USER']}>
                          <StudentTicketDetails />
                        </RoleGuard>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="admin/tickets"
                      element={
                        <RoleGuard allowedRoles={['ADMIN']}>
                          <AdminTicketDashboard />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="admin/tickets/:id"
                      element={
                        <RoleGuard allowedRoles={['ADMIN']}>
                          <AdminTicketDetails />
                        </RoleGuard>
                      }
                    />

                    {/* Technician Routes */}
                    <Route
                      path="technician/tickets"
                      element={
                        <RoleGuard allowedRoles={['TECHNICIAN']}>
                          <TechnicianWorklist />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="technician/tickets/:id"
                      element={
                        <RoleGuard allowedRoles={['TECHNICIAN']}>
                          <TechnicianTicketDetails />
                        </RoleGuard>
                      }
                    />

                    <Route path="tickets" element={<TicketRedirect />} />
                    <Route path="bookings" element={<Bookings />} />
                    <Route path="/" element={<RootRedirect />} />
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
