import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart2,
  Bell,
  Box,
  Calendar,
  LogOut,
  Menu,
  Settings,
  Ticket,
  User,
  Users,
  X,
} from 'lucide-react';
import NotificationBell from '../ui/NotificationBell';

const fallbackUser = {
  name: 'John Doe',
  role: 'STUDENT',
};

const getStoredUser = () => {
  if (typeof window === 'undefined') {
    return fallbackUser;
  }

  const storageKeys = ['user', 'currentUser', 'authUser'];

  for (const key of storageKeys) {
    const value = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);

    if (!value) {
      continue;
    }

    try {
      const parsed = JSON.parse(value);

      return {
        name: parsed.name || parsed.fullName || parsed.email || fallbackUser.name,
        role: parsed.role || parsed.userRole || fallbackUser.role,
        avatarUrl: parsed.avatarUrl || parsed.avatar || parsed.picture,
      };
    } catch {
      return fallbackUser;
    }
  }

  return fallbackUser;
};

const formatRole = (role) => String(role || 'USER').replace(/_/g, ' ').toUpperCase();

const getTicketPathForRole = (role) => {
  const normalizedRole = formatRole(role);

  if (normalizedRole === 'ADMIN') {
    return '/admin/tickets';
  }

  if (normalizedRole === 'TECHNICIAN') {
    return '/technician/tickets';
  }

  return '/student/tickets';
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(() => getStoredUser());
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = formatRole(user.role);
  const isAdmin = userRole === 'ADMIN';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart2 },
    { name: 'Facilities', path: '/facilities', icon: Box },
    { name: 'Bookings', path: '/bookings', icon: Calendar },
    { name: 'Tickets', path: getTicketPathForRole(userRole), icon: Ticket, aliases: ['/tickets', '/student/tickets', '/admin/tickets', '/technician/tickets'] },
    { name: 'Notifications', path: '/notifications', icon: Bell, aliases: ['/notifications'] },
    ...(isAdmin ? [{ name: 'Users', path: '/users', icon: Users }] : []),
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isNavItemActive = (item) => {
    const paths = [item.path, ...(item.aliases || [])];

    return paths.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      ['token', 'accessToken', 'user', 'currentUser', 'authUser'].forEach((key) => {
        window.localStorage.removeItem(key);
        window.sessionStorage.removeItem(key);
      });
    }

    setUser(fallbackUser);
    setIsMobileMenuOpen(false);
    navigate('/dashboard');
  };

  const renderNavLink = (item, isMobile = false) => {
    const Icon = item.icon;
    const isActive = isNavItemActive(item);

    return (
      <NavLink
        key={item.name}
        to={item.path}
        onClick={() => setIsMobileMenuOpen(false)}
        className={
          isMobile
            ? `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`
            : `inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`
        }
      >
        <Icon size={18} />
        <span>{item.name}</span>
      </NavLink>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <NavLink
            to="/dashboard"
            className="flex min-w-0 items-center gap-3"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold text-white shadow-sm">
              CH
            </span>
            <span className="truncate text-base font-bold text-slate-950 sm:text-lg">
              Campus Hub
            </span>
          </NavLink>
        </div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => renderNavLink(item))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationBell />

          <div className="hidden items-center gap-3 border-l border-slate-200 pl-3 sm:flex">
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold leading-5 text-slate-900">{user.name}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{userRole}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <User size={20} />
              )}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={19} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 lg:hidden"
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden">
          <nav className="mx-auto max-w-7xl space-y-1" aria-label="Mobile navigation">
            {navItems.map((item) => renderNavLink(item, true))}
          </nav>

          <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-lg bg-slate-50 px-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{userRole}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={19} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
