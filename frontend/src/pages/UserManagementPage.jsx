import React, { useEffect, useMemo, useState } from 'react';
import { Filter, Search, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const roles = ['ALL', 'USER', 'TECHNICIAN', 'ADMIN'];

const roleStyles = {
  ADMIN: 'bg-rose-50 text-rose-700 ring-rose-200',
  TECHNICIAN: 'bg-blue-50 text-blue-700 ring-blue-200',
  USER: 'bg-emerald-50 text-emerald-700 ring-emerald-200'
};

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
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

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch = !query
        || user.name?.toLowerCase().includes(query)
        || user.email?.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingUserId(userId);
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((user) => (
        user.id === userId ? { ...user, role: newRole } : user
      )));
      toast.success('Role updated successfully');
    } catch (error) {
      console.error('Failed to update role', error);
      toast.error('Failed to update role');
    } finally {
      setUpdatingUserId('');
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-500">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-white">
                <Users size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-950">User Management</h1>
                <p className="mt-1 text-sm text-slate-500">Search users, filter by role, and update access levels.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_180px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search name or email"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm font-medium text-slate-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role === 'ALL' ? 'All roles' : role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4 font-semibold">Name</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Provider</th>
                <th className="px-5 py-4 font-semibold">Current Role</th>
                <th className="px-5 py-4 font-semibold">Update Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900">{user.name || 'Unnamed user'}</div>
                    <div className="text-xs text-slate-400">{user.id}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold uppercase text-slate-600">
                      {user.provider || 'local'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${roleStyles[user.role] || roleStyles.USER}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={user.role}
                      disabled={updatingUserId === user.id}
                      onChange={(event) => handleRoleChange(user.id, event.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="USER">USER</option>
                      <option value="TECHNICIAN">TECHNICIAN</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-10 text-center text-sm text-slate-500">
            No users match the current search and role filter.
          </div>
        )}
      </section>
    </div>
  );
};

export default UserManagementPage;
