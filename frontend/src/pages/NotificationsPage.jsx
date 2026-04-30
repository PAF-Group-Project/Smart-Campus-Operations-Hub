import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Bell,
  CalendarCheck,
  Check,
  CheckCircle2,
  Inbox,
  Loader2,
  MessageSquareText,
  PlusCircle,
  ShieldCheck,
  Ticket,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  createTestNotification,
  deleteNotification,
  fetchMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from '../services/notificationService';

const typeConfig = {
  BOOKING: {
    icon: CalendarCheck,
    badge: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    iconWrap: 'bg-indigo-100 text-indigo-700'
  },
  TICKET: {
    icon: Ticket,
    badge: 'bg-blue-50 text-blue-700 ring-blue-200',
    iconWrap: 'bg-blue-100 text-blue-700'
  },
  COMMENT: {
    icon: MessageSquareText,
    badge: 'bg-violet-50 text-violet-700 ring-violet-200',
    iconWrap: 'bg-violet-100 text-violet-700'
  },
  SYSTEM: {
    icon: ShieldCheck,
    badge: 'bg-slate-100 text-slate-700 ring-slate-200',
    iconWrap: 'bg-slate-200 text-slate-700'
  }
};

const getNotificationId = (notification) => notification.id || notification._id;

const getTypeConfig = (type = 'SYSTEM') => typeConfig[type] || typeConfig.SYSTEM;

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [error, setError] = useState('');

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  const fetchNotifications = async () => {
    setError('');
    try {
      const data = await fetchMyNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications.');
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    setActiveId(id);
    setError('');
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          getNotificationId(notification) === id ? { ...notification, isRead: true } : notification
        )
      );
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking as read:', error);
      setError('Failed to mark notification as read.');
      toast.error('Failed to mark notification as read');
    } finally {
      setActiveId('');
    }
  };

  const handleMarkAllAsRead = async () => {
    setBusy(true);
    setError('');
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      setError('Failed to mark all notifications as read.');
      toast.error('Failed to mark all notifications as read');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    setActiveId(id);
    setError('');
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((notification) => getNotificationId(notification) !== id));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError('Failed to delete notification.');
      toast.error('Failed to delete notification');
    } finally {
      setActiveId('');
    }
  };

  const generateTestNotification = async () => {
    setBusy(true);
    setError('');
    try {
      const created = await createTestNotification();
      if (created) {
        setNotifications((prev) => [created, ...prev]);
      }
      toast.success('Notification created');
    } catch (error) {
      console.error('Error generating notification:', error);
      setError('Failed to create test notification.');
      toast.error('Failed to create test notification');
    } finally {
      setBusy(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-slate-100" />
        </div>
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <Bell size={22} />
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-rose-500 ring-4 ring-white" />}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Notification center</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Notifications</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'} waiting for you.` : 'You are fully caught up.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={generateTestNotification}
              disabled={busy}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
              Create Test Alert
            </button>
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={busy || unreadCount === 0}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              Mark all as read
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 ring-1 ring-rose-200">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}
      </section>

      <section className="space-y-3">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Inbox size={30} />
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-950">No notifications</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              New booking, ticket, comment, and system updates will appear here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const id = getNotificationId(notification);
            const type = notification.type || 'SYSTEM';
            const config = getTypeConfig(type);
            const Icon = config.icon;
            const isUnread = !notification.isRead;
            const isActive = activeId === id;

            return (
              <article
                key={id}
                className={`group rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  isUnread
                    ? 'border-indigo-200 bg-indigo-50/60 shadow-indigo-100/60'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${config.iconWrap}`}>
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className={`text-base font-bold ${isUnread ? 'text-slate-950' : 'text-slate-800'}`}>
                            {notification.title || 'Campus notification'}
                          </h2>
                          {isUnread && (
                            <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                              New
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{notification.message || 'No message provided.'}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${config.badge}`}>
                            {type}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">{formatDate(notification.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:pl-4">
                        {isUnread && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsRead(id)}
                            disabled={isActive}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-indigo-100 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label="Mark notification as read"
                            title="Mark as read"
                          >
                            {isActive ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(id)}
                          disabled={isActive}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label="Delete notification"
                          title="Delete"
                        >
                          {isActive ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
};

export default NotificationsPage;
