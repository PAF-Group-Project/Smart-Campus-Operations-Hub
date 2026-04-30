import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  CalendarCheck,
  CheckCircle2,
  Loader2,
  MessageSquareText,
  RotateCcw,
  Save,
  SlidersHorizontal,
  Ticket,
  Wrench
} from 'lucide-react';
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
    icon: CalendarCheck,
    tone: 'bg-indigo-50 text-indigo-700 ring-indigo-100'
  },
  {
    key: 'ticketNotifications',
    title: 'Ticket notifications',
    description: 'Maintenance ticket assignments, status updates, and escalations.',
    icon: Ticket,
    tone: 'bg-blue-50 text-blue-700 ring-blue-100'
  },
  {
    key: 'commentNotifications',
    title: 'Comment notifications',
    description: 'Replies and discussion activity on your campus workflows.',
    icon: MessageSquareText,
    tone: 'bg-violet-50 text-violet-700 ring-violet-100'
  },
  {
    key: 'systemNotifications',
    title: 'System notifications',
    description: 'Security messages, platform alerts, and admin announcements.',
    icon: Wrench,
    tone: 'bg-slate-100 text-slate-700 ring-slate-200'
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
    className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
      checked ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-slate-300'
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
  const enabledCount = useMemo(
    () => preferenceItems.filter((item) => preferences[item.key]).length,
    [preferences]
  );

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
    setPreferences((prev) => {
      const normalized = normalizePreferences(prev);
      return {
        ...normalized,
        [key]: !normalized[key]
      };
    });
  };

  const handleReset = () => {
    setPreferences(savedPreferences);
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
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-8 w-72 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-slate-100" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border-b border-slate-100 p-5 last:border-b-0">
              <div className="h-14 animate-pulse rounded-xl bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <Bell size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Notification settings</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Notification Preferences</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Choose which campus updates should appear in your notification center.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold ring-1 ${
                hasChanges
                  ? 'bg-amber-50 text-amber-700 ring-amber-200'
                  : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
              }`}
            >
              {hasChanges ? <SlidersHorizontal size={16} /> : <CheckCircle2 size={16} />}
              {hasChanges ? 'Unsaved changes' : 'Saved'}
            </div>
            <button
              type="button"
              onClick={handleReset}
              disabled={saving || !hasChanges}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving' : 'Save'}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Enabled categories</p>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-4xl font-bold text-slate-950">{enabledCount}</span>
            <span className="pb-1 text-sm font-semibold text-slate-500">of {preferenceItems.length}</span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${(enabledCount / preferenceItems.length) * 100}%` }}
            />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Fine tune alerts so only the campus updates you care about interrupt your workflow.
          </p>
        </aside>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-100">
            {preferenceItems.map((item) => {
              const Icon = item.icon;
              const enabled = preferences[item.key];

              return (
                <div key={item.key} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ring-1 ${item.tone}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold text-slate-950">{item.title}</h2>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                            enabled
                              ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                              : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
                          }`}
                        >
                          {enabled ? 'On' : 'Off'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                    </div>
                  </div>
                  <Toggle
                    checked={enabled}
                    disabled={saving}
                    onChange={() => togglePreference(item.key)}
                    label={item.title}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotificationPreferencesPage;
