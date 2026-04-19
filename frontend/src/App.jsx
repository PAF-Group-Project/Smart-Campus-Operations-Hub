import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/protected/ProtectedRoute';
import RoleGuard from './components/protected/RoleGuard';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Placeholder Pages
const Dashboard = () => <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100"><h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2><p className="text-slate-600">Welcome to the Smart Campus Operations Hub.</p></div>;
const Facilities = () => <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">Facilities Placeholder (Admin/Tech Only)</div>;
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
                    <Route path="dashboard" element={<Dashboard />} />
                    
                    {/* Example of a Role Protected Route */}
                    <Route 
                      path="facilities" 
                      element={
                        <RoleGuard allowedRoles={['ADMIN', 'TECHNICIAN']}>
                          <Facilities />
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
