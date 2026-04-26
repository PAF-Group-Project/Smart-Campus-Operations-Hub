import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Feature Pages
import { ResourceListPage } from './pages/facilities/ResourceListPage';
import { ResourceDetailPage } from './pages/facilities/ResourceDetailPage';

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
