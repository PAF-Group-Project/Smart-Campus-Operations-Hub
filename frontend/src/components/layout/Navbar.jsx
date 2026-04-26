import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../ui/NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div className="flex items-center gap-8">
        {user?.role === 'TECHNICIAN' && (
          <Link to="/technician/tickets" className="hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-bold text-primary-900">Campus Hub</h1>
          </Link>
        )}
        
        <div className="relative w-96 hidden md:block">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            placeholder="Search for something..." 
            className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <NotificationBell />
        
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{user?.name || 'Guest'}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider">{user?.role || 'Visitor'}</p>
          </div>
          {user?.avatar ? (
            <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
              <User size={20} />
            </div>
          )}
        </div>
        
        <button 
          onClick={logout}
          className="text-slate-400 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
