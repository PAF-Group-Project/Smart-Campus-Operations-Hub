import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const isTechnician = user?.role === 'TECHNICIAN';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {!isTechnician && <Sidebar />}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
