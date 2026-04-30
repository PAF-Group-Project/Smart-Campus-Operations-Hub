import { useEffect, useRef, useState } from 'react';
import { Bell, BellRing, ChevronRight, Inbox, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  fetchMyNotifications,
  fetchUnreadNotificationCount
} from '../../services/notificationService';

const getNotificationId = (notification) => notification.id || notification._id;

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    const loadUnreadCount = async () => {
      try {
        const count = await fetchUnreadNotificationCount();
        if (!ignore) {
          setUnreadCount(count);
        }
      } catch (error) {
        console.error('Failed to fetch unread notifications count:', error);
      }
    };

    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadPreview = async () => {
    setPreviewLoading(true);
    try {
      const data = await fetchMyNotifications();
      setPreview(Array.isArray(data) ? data.slice(0, 4) : []);
    } catch (error) {
      console.error('Failed to fetch notification preview:', error);
      setPreview([]);
    } finally {
      setPreviewLoading(false);
    }
  };

  const toggleDropdown = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      await loadPreview();
    }
  };

  const goToNotifications = () => {
    setOpen(false);
    navigate('/notifications');
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        title="Notifications"
      >
        {unreadCount > 0 ? <BellRing size={20} /> : <Bell size={20} />}
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold leading-none text-white ring-2 ring-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-slate-950">Notifications</p>
              <p className="text-xs font-medium text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>
            <button
              type="button"
              onClick={goToNotifications}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              View all
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {previewLoading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm font-semibold text-slate-500">
                <Loader2 size={18} className="animate-spin text-indigo-600" />
                Loading
              </div>
            ) : preview.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Inbox size={24} />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-900">No notifications</p>
                <p className="mt-1 text-xs text-slate-500">New campus updates will show here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {preview.map((notification) => {
                  const isUnread = !notification.isRead;

                  return (
                    <button
                      key={getNotificationId(notification)}
                      type="button"
                      onClick={goToNotifications}
                      className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    >
                      <span
                        className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                          isUnread ? 'bg-indigo-600' : 'bg-slate-300'
                        }`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-sm ${isUnread ? 'font-bold text-slate-950' : 'font-semibold text-slate-700'}`}>
                          {notification.title || 'Campus notification'}
                        </span>
                        <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-500">
                          {notification.message || 'No message provided.'}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
