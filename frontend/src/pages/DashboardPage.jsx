import { createElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Bell,
  Calendar,
  Clock3,
  Inbox,
  LayoutDashboard,
  Loader2,
  Settings,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserCog,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import campusImg from '../assets/campus-illustration.png';
import {
  fetchMyNotifications,
  fetchUnreadNotificationCount
} from '../services/notificationService';

const roleStyles = {
  ADMIN: 'bg-rose-50 text-rose-700 ring-rose-200',
  TECHNICIAN: 'bg-blue-50 text-blue-700 ring-blue-200',
  USER: 'bg-emerald-50 text-emerald-700 ring-emerald-200'
};

const notificationTypeStyles = {
  BOOKING: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  TICKET: 'bg-orange-50 text-orange-700 ring-orange-200',
  COMMENT: 'bg-violet-50 text-violet-700 ring-violet-200',
  SYSTEM: 'bg-blue-50 text-blue-700 ring-blue-200',
  USER: 'bg-purple-50 text-purple-700 ring-purple-200'
};

const notificationDotStyles = {
  BOOKING: 'bg-emerald-500',
  TICKET: 'bg-orange-500',
  COMMENT: 'bg-violet-500',
  SYSTEM: 'bg-blue-500',
  USER: 'bg-purple-500'
};

const getTicketPath = (role) => {
  switch (role) {
    case 'ADMIN':
      return '/admin/tickets';
    case 'TECHNICIAN':
      return '/technician/tickets';
    case 'USER':
      return '/student/tickets';
    default:
      return '/tickets';
  }
};

const getNotificationId = (notification) => notification.id || notification._id;

const formatDate = (dateString) => {
  if (!dateString) return 'Today';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(new Date(dateString));
};

const StatCard = ({ title, value, description, icon, tone, valueTone, waveTone, delay = 0, live = false }) => (
  <div
    className="dashboard-reveal group relative min-h-[145px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/90"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="relative z-10 flex items-start gap-4">
      <div className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 ${tone}`}>
        {live && <span className="absolute inset-2 rounded-full bg-orange-400/20 animate-ping" />}
        <span className="relative">{createElement(icon, { size: 22 })}</span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-700">{title}</p>
        <p className={`mt-1 text-3xl font-extrabold tracking-tight ${valueTone}`}>{value}</p>
        <p className="mt-1 text-sm font-medium leading-5 text-slate-500">{description}</p>
      </div>
    </div>
    <svg className={`absolute -bottom-2 left-0 h-12 w-full ${waveTone}`} viewBox="0 0 400 64" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 38 C42 16 70 58 113 36 C155 14 184 58 227 35 C269 13 296 57 340 34 C365 21 384 22 400 28 L400 64 L0 64 Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

const QuickActionCard = ({ title, description, path, icon, tone, emphasis, delay = 0 }) => (
  <Link
    to={path}
    className={`dashboard-reveal group rounded-2xl border bg-white p-5 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
      emphasis ? 'border-indigo-200' : 'border-slate-200'
    }`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between gap-3">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition group-hover:scale-105 ${tone}`}>
        {createElement(icon, { size: 22 })}
      </div>
      <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
    </div>
    <h3 className="mt-5 text-base font-bold text-slate-950">{title}</h3>
    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{description}</p>
  </Link>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [notificationError, setNotificationError] = useState('');

  const role = user?.role || 'USER';
  const displayName = user?.name || 'System Admin';
  const now = new Date();
  const currentHour = now.getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  const todayLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(now);
  const timeLabel = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(now);

  useEffect(() => {
    let ignore = false;

    const loadNotificationData = async () => {
      setLoadingNotifications(true);
      setNotificationError('');

      try {
        const [notificationData, unreadTotal] = await Promise.all([
          fetchMyNotifications(),
          fetchUnreadNotificationCount()
        ]);

        if (!ignore) {
          setNotifications(Array.isArray(notificationData) ? notificationData : []);
          setUnreadCount(Number(unreadTotal) || 0);
        }
      } catch (error) {
        console.error('Failed to load dashboard notifications', error);
        if (!ignore) {
          setNotificationError('Recent activity is unavailable right now.');
          setNotifications([]);
          setUnreadCount(0);
        }
      } finally {
        if (!ignore) {
          setLoadingNotifications(false);
        }
      }
    };

    loadNotificationData();

    return () => {
      ignore = true;
    };
  }, []);

  const quickActions = useMemo(() => {
    const actions = [
      {
        title: 'Browse Resources',
        description: 'Find bookable rooms, labs, halls, and campus equipment.',
        path: '/resources',
        icon: LayoutDashboard,
        tone: 'bg-purple-50 text-purple-700 ring-purple-100'
      },
      {
        title: 'Bookings',
        description: 'View and manage reservations and bookings.',
        path: '/bookings',
        icon: Calendar,
        tone: 'bg-blue-50 text-blue-700 ring-blue-100'
      },
      {
        title: 'Tickets',
        description: role === 'TECHNICIAN' ? 'Open assigned technician jobs.' : 'Track incident and maintenance requests.',
        path: getTicketPath(role),
        icon: Ticket,
        tone: 'bg-orange-50 text-orange-700 ring-orange-100',
        emphasis: role === 'TECHNICIAN'
      },
      {
        title: 'Notifications',
        description: 'View alerts, workflow updates, and messages.',
        path: '/notifications',
        icon: Bell,
        tone: 'bg-pink-50 text-pink-700 ring-pink-100'
      },
      {
        title: 'Notification Preferences',
        description: 'Choose which campus updates you want to receive.',
        path: '/settings/notifications',
        icon: Settings,
        tone: 'bg-violet-50 text-violet-700 ring-violet-100'
      }
    ];

    if (role === 'ADMIN') {
      actions.splice(4, 0, {
        title: 'User Management',
        description: 'Manage users, roles, and admin access levels.',
        path: '/users',
        icon: Users,
        tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
        emphasis: true
      });
    }

    return actions;
  }, [role]);

  const latestNotifications = useMemo(() => notifications.slice(0, 4), [notifications]);

  const stats = [
    {
      title: 'Unread Notifications',
      value: loadingNotifications ? '...' : unreadCount,
      description: unreadCount > 0 ? 'Action may be needed today' : 'No pending alerts',
      icon: Bell,
      tone: 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white ring-indigo-200',
      valueTone: 'text-indigo-600',
      waveTone: 'text-indigo-100/80'
    },
    {
      title: 'Current Role',
      value: role,
      description: role === 'ADMIN' ? 'Full access to all modules' : role === 'TECHNICIAN' ? 'Technician workspace access' : 'Standard campus access',
      icon: ShieldCheck,
      tone: 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white ring-emerald-200',
      valueTone: 'text-emerald-600',
      waveTone: 'text-emerald-100/80'
    },
    {
      title: 'Available Modules',
      value: quickActions.length,
      description: 'Modules available for you',
      icon: Sparkles,
      tone: 'bg-gradient-to-br from-blue-500 to-sky-500 text-white ring-blue-200',
      valueTone: 'text-blue-600',
      waveTone: 'text-blue-100/80'
    },
    {
      title: 'System Status',
      value: 'Active',
      description: 'All systems operational',
      icon: Activity,
      tone: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white ring-orange-200',
      valueTone: 'text-orange-600',
      waveTone: 'text-orange-100/80',
      live: true
    }
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <style>
        {`
          @keyframes dashboardFadeUp {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .dashboard-reveal {
            opacity: 0;
            animation: dashboardFadeUp 460ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }

          .dashboard-hero-art {
            -webkit-mask-image: radial-gradient(ellipse at 56% 50%, #000 48%, rgba(0, 0, 0, 0.72) 62%, transparent 82%);
            mask-image: radial-gradient(ellipse at 56% 50%, #000 48%, rgba(0, 0, 0, 0.72) 62%, transparent 82%);
          }

          @media (prefers-reduced-motion: reduce) {
            .dashboard-reveal {
              opacity: 1;
              transform: none;
              animation: none;
            }
          }
        `}
      </style>

      <section className="dashboard-reveal overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-indigo-100 shadow-sm shadow-blue-100/70">
        <div className="relative min-h-[270px] p-6 sm:p-8">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 hidden h-32 w-32 rounded-full bg-blue-200/30 blur-2xl lg:block" />

          <div className="relative grid min-h-[220px] items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(340px,0.95fr)]">
            <div className="min-w-0">
              <p className="text-base font-medium text-slate-600">
                {greeting}, <span className="font-bold text-slate-900">{displayName}</span>
              </p>
              <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight tracking-normal text-slate-950">
                Welcome to Smart Campus Operations Hub
              </h1>
              <p className="mt-4 max-w-xl text-base font-medium leading-7 text-slate-600">
                Monitor campus activity, manage resources, and stay informed with real-time updates.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-4 py-3 text-sm font-bold text-indigo-700 ring-1 ring-indigo-100">
                  <Calendar size={17} />
                  Today is {todayLabel}
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-4 py-3 text-sm font-bold text-indigo-700 ring-1 ring-indigo-100">
                  <Clock3 size={17} />
                  {timeLabel}
                </span>
                <span className={`inline-flex items-center rounded-xl px-4 py-3 text-sm font-bold ring-1 ${roleStyles[role] || roleStyles.USER}`}>
                  {role}
                </span>
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-xl items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-l from-blue-100/70 via-blue-50/35 to-transparent">
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent" />
              <div className="absolute inset-x-10 bottom-5 h-16 rounded-full bg-indigo-400/15 blur-3xl" />
              <img
                src={campusImg}
                alt="Isometric smart campus illustration"
                className="dashboard-hero-art relative h-60 w-full scale-125 object-contain drop-shadow-2xl sm:h-72 lg:h-80"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={70 + index * 55} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(380px,0.8fr)]">
        <div className="dashboard-reveal rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70" style={{ animationDelay: '270ms' }}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950">Quick Actions</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Access the modules you use most</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 ring-1 ring-indigo-100">
              <LayoutDashboard size={17} />
              {quickActions.length} Modules
            </span>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
            {quickActions.map((action, index) => (
              <QuickActionCard key={action.title} {...action} delay={340 + index * 45} />
            ))}
          </div>
        </div>

        <aside className="dashboard-reveal rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70" style={{ animationDelay: '330ms' }}>
          <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950">Recent Activity</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Latest notifications and system updates</p>
            </div>
            <Link
              to="/notifications"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              View all
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="p-5">
            {loadingNotifications ? (
              <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-50 px-4 py-14 text-sm font-semibold text-slate-500">
                <Loader2 size={18} className="animate-spin text-indigo-600" />
                Loading activity
              </div>
            ) : notificationError ? (
              <div className="rounded-2xl bg-amber-50 px-4 py-5 text-sm font-semibold leading-6 text-amber-700 ring-1 ring-amber-200">
                {notificationError}
              </div>
            ) : latestNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-14 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                  <Inbox size={26} />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-950">No recent activity</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  New campus updates will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {latestNotifications.map((notification, index) => {
                  const type = notification.type || 'SYSTEM';
                  const unread = !notification.isRead;
                  const TypeIcon = type === 'BOOKING' ? Calendar : type === 'TICKET' ? Ticket : type === 'COMMENT' ? Users : Bell;

                  return (
                    <article
                      key={getNotificationId(notification)}
                      className="dashboard-reveal flex items-center gap-4 py-4"
                      style={{ animationDelay: `${420 + index * 55}ms` }}
                    >
                      <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${notificationDotStyles[type] || notificationDotStyles.SYSTEM}`} />
                      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${notificationTypeStyles[type] || notificationTypeStyles.SYSTEM}`}>
                        <TypeIcon size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-bold text-slate-950">
                          {notification.title || 'Campus notification'}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-sm leading-5 text-slate-500">
                          {notification.message || 'No message provided.'}
                        </p>
                        <div className="mt-1 text-xs font-semibold text-slate-400">
                          {formatDate(notification.createdAt)}
                        </div>
                      </div>
                      <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 ${notificationTypeStyles[type] || notificationTypeStyles.SYSTEM}`}>
                        {type}
                      </span>
                      {unread && <span className="sr-only">Unread</span>}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
};

export default DashboardPage;
