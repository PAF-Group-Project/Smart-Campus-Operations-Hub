import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart2,
  Calendar,
  Box,
  Ticket,
  Bell,
  Settings,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const getTicketPath = () => {
    switch (user?.role) {
      case 'ADMIN': return '/admin/tickets';
      case 'TECHNICIAN': return '/technician/tickets';
      case 'USER': return '/student/tickets';
      default: return '/dashboard';
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart2 },
    { name: 'Facilities', path: '/facilities', icon: Box },
    { name: 'Bookings', path: '/bookings', icon: Calendar },
    { name: 'Tickets', path: getTicketPath(), icon: Ticket },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Users', path: '/users', icon: Users, role: 'ADMIN' },
  ];

  const visibleNavItems = navItems.filter((item) => !item.role || item.role === user?.role);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen h-full sticky top-0">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-primary-900">Campus Hub</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <NavLink
          to="/settings/notifications"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
              ? 'bg-primary-50 text-primary-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
