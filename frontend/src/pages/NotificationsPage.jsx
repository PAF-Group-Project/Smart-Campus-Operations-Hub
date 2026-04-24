import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  createTestNotification,
  deleteNotification,
  fetchMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from '../services/notificationService';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setError('');
    try {
      const data = await fetchMyNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      ));
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking as read:', error);
      setError('Failed to mark notification as read.');
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    setBusy(true);
    setError('');
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
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
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(notif => notif.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError('Failed to delete notification.');
      toast.error('Failed to delete notification');
    }
  };

  const generateTestNotification = async () => {
    setBusy(true);
    setError('');
    try {
      const created = await createTestNotification();
      if (created) {
        setNotifications([created, ...notifications]);
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
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
    }).format(date);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading notifications...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="text-primary-500" />
            Notifications
          </h1>
          <p className="text-slate-500 mt-1">Stay updated with your campus activities</p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={generateTestNotification}
            disabled={busy}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Create Test Alert
          </button>
          <button 
            onClick={handleMarkAllAsRead}
            disabled={busy || !notifications.some(n => !n.isRead)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-800">No notifications</h3>
            <p className="text-slate-500 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`group p-5 flex gap-4 transition-colors hover:bg-slate-50 ${!notif.isRead ? 'bg-blue-50/30' : 'bg-white'}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-2 h-2 rounded-full ${!notif.isRead ? 'bg-primary-500' : 'bg-transparent'}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-sm font-semibold ${!notif.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {notif.type}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatDate(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notif.isRead && (
                        <button 
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(notif.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
