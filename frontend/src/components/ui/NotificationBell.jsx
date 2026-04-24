import React from 'react';
import { Bell } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const NotificationBell = ({ unreadCount = 0 }) => {
  const hasUnread = unreadCount > 0;

  return (
    <NavLink
      to="/notifications"
      className={({ isActive }) =>
        `relative inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950'
        }`
      }
      aria-label={hasUnread ? `${unreadCount} unread notifications` : 'Notifications'}
      title="Notifications"
    >
      <Bell size={20} />
      {hasUnread && (
        <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </NavLink>
  );
};

export default NotificationBell;
