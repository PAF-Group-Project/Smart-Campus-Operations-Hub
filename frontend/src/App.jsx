import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';

// Ticket Module Pages
import StudentTicketList from './features/ticket/pages/StudentTicketList';
import StudentCreateTicket from './features/ticket/pages/StudentCreateTicket';
import StudentTicketDetails from './features/ticket/pages/StudentTicketDetails';
import AdminTicketDashboard from './features/ticket/pages/AdminTicketDashboard';
import AdminTicketDetails from './features/ticket/pages/AdminTicketDetails';
import TechnicianWorklist from './features/ticket/pages/TechnicianWorklist';
import TechnicianTicketDetails from './features/ticket/pages/TechnicianTicketDetails';

const Dashboard = () => <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 font-sans"><h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2><p className="text-slate-600">Welcome to the Smart Campus Operations Hub.</p></div>;

function App() {
  return (
    <Router>
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
