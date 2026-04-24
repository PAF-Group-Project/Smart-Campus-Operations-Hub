import React from 'react';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
