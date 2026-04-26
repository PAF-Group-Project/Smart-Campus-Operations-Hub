import { useEffect, useState } from 'react';
import { Bell, CalendarCheck, MessageSquareText, Save, Ticket, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchNotificationPreferences,
  updateNotificationPreferences
} from '../services/preferenceService';

const preferenceItems = [
  {
    key: 'bookingNotifications',
    title: 'Booking notifications',
    description: 'Room reservations, approval updates, and booking changes.',
    icon: CalendarCheck
  },
  {
    key: 'ticketNotifications',
    title: 'Ticket notifications',
    description: 'Maintenance ticket assignments, status updates, and escalations.',
    icon: Ticket
  },
  {
    key: 'commentNotifications',
    title: 'Comment notifications',
    description: 'Replies and discussion activity on your campus workflows.',
    icon: MessageSquareText
  },
  {
    key: 'systemNotifications',
    title: 'System notifications',
    description: 'Security messages, platform alerts, and admin announcements.',
    icon: Wrench
  }
];

const defaultPreferences = {
  bookingNotifications: true,
  ticketNotifications: true,
  commentNotifications: true,
  systemNotifications: true
};

const normalizePreferences = (preferences = {}) => ({
  ...defaultPreferences,
  bookingNotifications: Boolean(preferences.bookingNotifications ?? true),
  ticketNotifications: Boolean(preferences.ticketNotifications ?? true),
  commentNotifications: Boolean(preferences.commentNotifications ?? true),
  systemNotifications: Boolean(preferences.systemNotifications ?? true)
});

const arePreferencesEqual = (current, saved) =>
  preferenceItems.every((item) => current?.[item.key] === saved?.[item.key]);

const Toggle = ({ checked, onChange, label, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={onChange}
    className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
      checked ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-slate-300'
    }`}
  >
    <span
      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-1 ring-slate-900/10 transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-0'
      }`}
    />
  </button>
);

const NotificationPreferencesPage = () => {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [savedPreferences, setSavedPreferences] = useState(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const hasChanges = !arePreferencesEqual(preferences, savedPreferences);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const data = await fetchNotificationPreferences();
        const normalized = normalizePreferences(data);
        setPreferences(normalized);
        setSavedPreferences(normalized);
      } catch (error) {
        console.error('Failed to load notification preferences', error);
        toast.error('Failed to load notification preferences');
        setPreferences(defaultPreferences);
        setSavedPreferences(defaultPreferences);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const togglePreference = (key) => {
    setPreferences((prev) => ({
      ...normalizePreferences(prev),
      [key]: !normalizePreferences(prev)[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = normalizePreferences(await updateNotificationPreferences(preferences));
      setPreferences(updated);
      setSavedPreferences(updated);
      toast.success('Notification preferences saved');
    } catch (error) {
      console.error('Failed to save notification preferences', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading notification preferences...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                <Bell size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-950">Notification Preferences</h1>
                <p className="mt-1 text-sm text-slate-500">Choose which campus updates should reach you.</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
          {preferenceItems.map((item) => {
            const Icon = item.icon;
            const enabled = preferences[item.key];

            return (
              <div key={item.key} className="flex items-center justify-between gap-4 p-5">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600 ring-1 ring-slate-200">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">{item.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <span className={`w-8 text-right text-xs font-semibold ${enabled ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {enabled ? 'ON' : 'OFF'}
                  </span>
                  <Toggle
                    checked={enabled}
                    disabled={saving}
                    onChange={() => togglePreference(item.key)}
                    label={item.title}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default NotificationPreferencesPage;
