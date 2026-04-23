import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/layout/DashboardLayout';

// Ticket Module Pages
import StudentTicketList from './features/ticket/pages/StudentTicketList';
import StudentCreateTicket from './features/ticket/pages/StudentCreateTicket';
import StudentTicketDetails from './features/ticket/pages/StudentTicketDetails';
import AdminTicketDashboard from './features/ticket/pages/AdminTicketDashboard';
import AdminTicketDetails from './features/ticket/pages/AdminTicketDetails';
import TechnicianWorklist from './features/ticket/pages/TechnicianWorklist';
import TechnicianTicketDetails from './features/ticket/pages/TechnicianTicketDetails';

// Facilities / Resource Pages
import { ResourceListPage } from './pages/facilities/ResourceListPage';
import { ResourceDetailPage } from './pages/facilities/ResourceDetailPage';

// Placeholder Pages
const Dashboard = () => <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 font-sans"><h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2><p className="text-slate-600">Welcome to the Smart Campus Operations Hub.</p></div>;
const Bookings = () => <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">Bookings Placeholder</div>;

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route 
          path="/*" 
          element={
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />

                {/* Student Routes */}
                <Route path="student/tickets" element={<StudentTicketList />} />
                <Route path="student/tickets/new" element={<StudentCreateTicket />} />
                <Route path="student/tickets/:id" element={<StudentTicketDetails />} />

                {/* Admin Routes */}
                <Route path="admin/tickets" element={<AdminTicketDashboard />} />
                <Route path="admin/tickets/:id" element={<AdminTicketDetails />} />

                {/* Technician Routes */}
                <Route path="technician/tickets" element={<TechnicianWorklist />} />
                <Route path="technician/tickets/:id" element={<TechnicianTicketDetails />} />

                {/* Facilities Routes */}
                <Route path="facilities" element={<ResourceListPage />} />
                <Route path="facilities/:id" element={<ResourceDetailPage />} />

                {/* Bookings */}
                <Route path="bookings" element={<Bookings />} />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </DashboardLayout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
