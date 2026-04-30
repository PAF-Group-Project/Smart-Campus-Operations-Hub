import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Filter,
  Loader2,
  Mail,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const roles = ['ALL', 'USER', 'TECHNICIAN', 'ADMIN'];
const editableRoles = ['USER', 'TECHNICIAN', 'ADMIN'];

const roleStyles = {
  ADMIN: 'bg-rose-50 text-rose-700 ring-rose-200',
  TECHNICIAN: 'bg-blue-50 text-blue-700 ring-blue-200',
  USER: 'bg-emerald-50 text-emerald-700 ring-emerald-200'
};

const roleIconStyles = {
  ADMIN: 'bg-rose-100 text-rose-700',
  TECHNICIAN: 'bg-blue-100 text-blue-700',
  USER: 'bg-emerald-100 text-emerald-700'
};

const getUserId = (user) => user.id || user._id;

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [pendingRoles, setPendingRoles] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(Array.isArray(response) ? response : response?.data || []);
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const stats = useMemo(
    () => [
      { label: 'Total users', value: users.length, icon: Users, tone: 'bg-indigo-50 text-indigo-700 ring-indigo-100' },
      {
        label: 'Admins',
        value: users.filter((user) => user.role === 'ADMIN').length,
        icon: ShieldCheck,
        tone: 'bg-rose-50 text-rose-700 ring-rose-100'
      },
      {
        label: 'Technicians',
        value: users.filter((user) => user.role === 'TECHNICIAN').length,
        icon: UserCog,
        tone: 'bg-blue-50 text-blue-700 ring-blue-100'
      }
    ],
    [users]
  );

  const handlePendingRoleChange = (userId, newRole) => {
    setPendingRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingUserId(userId);
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((user) => (getUserId(user) === userId ? { ...user, role: newRole } : user))
      );
      setPendingRoles((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
      toast.success('Role updated successfully');
    } catch (error) {
      console.error('Failed to update role', error);
      toast.error('Failed to update role');
    } finally {
      setUpdatingUserId('');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-slate-100" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <Users size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Admin controls</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">User Management</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Search campus accounts, review providers, and update user access levels.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_180px]">
            <label className="relative block">
              <span className="sr-only">Search users</span>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search name or email"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <label className="relative block">
              <span className="sr-only">Filter by role</span>
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm font-bold text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role === 'ALL' ? 'All roles' : role}
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </label>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{stat.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${stat.tone}`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-bold text-slate-950">Campus accounts</h2>
            <p className="text-sm text-slate-500">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={28} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-950">No users found</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Try a different name, email, or role filter to find the account you need.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4 font-bold">User</th>
                  <th className="px-5 py-4 font-bold">Email</th>
                  <th className="px-5 py-4 font-bold">Provider</th>
                  <th className="px-5 py-4 font-bold">Role</th>
                  <th className="px-5 py-4 font-bold">Change role</th>
                  <th className="px-5 py-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const userId = getUserId(user);
                  const selectedRole = pendingRoles[userId] || user.role || 'USER';
                  const hasRoleChange = selectedRole !== user.role;
                  const isUpdating = updatingUserId === userId;
                  const initials = (user.name || user.email || 'U')
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr key={userId} className="transition-colors hover:bg-indigo-50/30">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${roleIconStyles[user.role] || roleIconStyles.USER}`}>
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-950">{user.name || 'Unnamed user'}</div>
                            <div className="text-xs text-slate-400">{userId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <Mail size={15} className="text-slate-400" />
                          {user.email || 'No email'}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase text-slate-600 ring-1 ring-slate-200">
                          {user.provider || 'local'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${roleStyles[user.role] || roleStyles.USER}`}>
                          {user.role || 'USER'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={selectedRole}
                          disabled={isUpdating}
                          onChange={(event) => handlePendingRoleChange(userId, event.target.value)}
                          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label={`Select role for ${user.name || user.email || 'user'}`}
                        >
                          {editableRoles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          disabled={!hasRoleChange || isUpdating}
                          onClick={() => handleRoleChange(userId, selectedRole)}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
                        >
                          {isUpdating ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                          Update
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserManagementPage;
