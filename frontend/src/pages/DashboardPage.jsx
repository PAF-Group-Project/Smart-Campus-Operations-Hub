import { useEffect, useState } from 'react';
import { Bell, ShieldCheck, Users, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { fetchAdminStats } from '../services/adminService';

const statConfig = [
  { key: 'totalUsers', label: 'Total Users', icon: Users, tone: 'bg-blue-50 text-blue-700 ring-blue-100' },
  { key: 'totalAdmins', label: 'Total Admins', icon: ShieldCheck, tone: 'bg-rose-50 text-rose-700 ring-rose-100' },
  { key: 'totalTechnicians', label: 'Total Technicians', icon: Wrench, tone: 'bg-amber-50 text-amber-700 ring-amber-100' },
  { key: 'totalNotifications', label: 'Total Notifications', icon: Bell, tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
  { key: 'unreadNotifications', label: 'Unread Notifications', icon: Bell, tone: 'bg-violet-50 text-violet-700 ring-violet-100' }
];

const StatCard = ({ label, value, icon: Icon, tone }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{value ?? 0}</p>
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-lg ring-1 ${tone}`}>
        <Icon size={22} />
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(user?.role === 'ADMIN');

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      setLoadingStats(false);
      return;
    }

    const loadStats = async () => {
      try {
        const data = await fetchAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load admin stats', error);
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [user?.role]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">
          Smart Campus Operations Hub
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">Dashboard Overview</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Welcome back, {user?.name || 'team member'}. Monitor operations, users, and notifications from one clean command view.
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200">
            Role: <span className="font-semibold text-slate-900">{user?.role || 'USER'}</span>
          </div>
        </div>
      </section>

      {user?.role === 'ADMIN' && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Admin Analytics</h2>
              <p className="text-sm text-slate-500">Fast demo metrics for user roles and notification activity.</p>
            </div>
          </div>

          {loadingStats ? (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
              Loading analytics...
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {statConfig.map((item) => (
                <StatCard
                  key={item.key}
                  label={item.label}
                  value={stats?.[item.key]}
                  icon={item.icon}
                  tone={item.tone}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default DashboardPage;
