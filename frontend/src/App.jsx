import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ResourceAuthProvider } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/protected/ProtectedRoute';

// Resource pages
import { BrowseResourcesPage } from './pages/facilities/BrowseResourcesPage';
import { ResourceDetailPage } from './pages/facilities/ResourceDetailPage';

// Resource Admin pages
import { AdminResourceDashboardPage } from './pages/admin/AdminResourceDashboardPage';
import { ManageResourcesPage } from './pages/admin/ManageResourcesPage';
import { ResourceStatsPage } from './pages/admin/ResourceStatsPage';

// Placeholder Pages (unchanged from original)
const Dashboard = () => <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100"><h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2><p className="text-slate-600">Welcome to the Smart Campus Operations Hub.</p></div>;
const Login = () => <div className="min-h-screen flex items-center justify-center bg-slate-50">Login Page Placeholder</div>;
const Bookings = () => <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">Bookings Placeholder</div>;

function App() {
  return (
    <ResourceAuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />

                    {/* Resources — user-facing browse */}
                    <Route path="resources" element={<BrowseResourcesPage />} />
                    <Route path="resources/:id" element={<ResourceDetailPage />} />

                    {/* Resource Admin pages — auth handled inside components */}
                    <Route path="admin/dashboard" element={<AdminResourceDashboardPage />} />
                    <Route path="admin/manage" element={<ManageResourcesPage />} />
                    <Route path="admin/stats" element={<ResourceStatsPage />} />

                    <Route path="bookings" element={<Bookings />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ResourceAuthProvider>
  );
}

export default App;
