import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getResourceStats, getAllResources, createResource } from '../../services/resourceService';
import { ResourceFormModal } from '../../components/facilities/ResourceFormModal';
import { SkeletonCard } from '../../components/ui/SkeletonCard';
import { TypeBadge, StatusBadge } from '../../components/facilities/ResourceCard';
import { ResourceAdminGate } from '../../components/facilities/ResourceAdminGate';
import toast from 'react-hot-toast';
import { Package, Activity, AlertTriangle, Wrench, Plus, ArrowRight } from 'lucide-react';

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#f97316', '#6b7280'];
const BAR_COLORS = ['#6366f1', '#8b5cf6', '#f97316', '#10b981'];

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className={`${bg} rounded-2xl p-6 flex items-center gap-5 border border-white/50 shadow-sm`}>
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0`}>
      <Icon size={26} className="text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {value !== undefined ? (
        <p className="text-3xl font-extrabold text-gray-900">{value}</p>
      ) : (
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1" />
      )}
    </div>
  </div>
);

export const AdminResourceDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, resourcesRes] = await Promise.all([getResourceStats(), getAllResources()]);
      const statsData = statsRes?.data ?? statsRes;
      const resourcesData = Array.isArray(resourcesRes) ? resourcesRes : (resourcesRes?.data || []);
      setStats(statsData);
      setResources(resourcesData);
    } catch (e) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (data) => {
    try {
      await createResource(data);
      toast.success('Resource created!');
      setIsModalOpen(false);
      fetchAll();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to create resource');
      throw e;
    }
  };

  // Prepare chart data
  const pieData = stats ? [
    { name: 'Labs', value: stats.countByType?.LAB || 0 },
    { name: 'Lecture Halls', value: stats.countByType?.LECTURE_HALL || 0 },
    { name: 'Meeting Rooms', value: stats.countByType?.MEETING_ROOM || 0 },
    { name: 'Equipment', value: stats.countByType?.EQUIPMENT || 0 },
  ] : [];

  const buildingMap = {};
  resources.forEach(r => {
    if (r.building) buildingMap[r.building] = (buildingMap[r.building] || 0) + 1;
  });
  const barData = Object.entries(buildingMap).map(([name, count]) => ({ name, count }));

  const recent5 = [...resources].sort((a, b) => {
    const da = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const db = b.createdAt ? new Date(b.createdAt) : new Date(0);
    return db - da;
  }).slice(0, 5);

  return (
    <ResourceAdminGate>
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Resource Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of all campus facilities and assets</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
            <Plus size={16} /> Add Resource
          </button>
          <button onClick={() => navigate('/admin/manage')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors">
            View All <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard icon={Package} label="Total Resources" value={stats?.totalResources} color="bg-indigo-500" bg="bg-indigo-50" />
        <StatCard icon={Activity} label="Active" value={stats?.activeCount} color="bg-green-500" bg="bg-green-50" />
        <StatCard icon={AlertTriangle} label="Out of Service" value={stats?.outOfServiceCount} color="bg-red-500" bg="bg-red-50" />
        <StatCard icon={Wrench} label="Under Maintenance" value={stats?.underMaintenanceCount} color="bg-yellow-500" bg="bg-yellow-50" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-1">Resources by Type</h2>
          <p className="text-xs text-gray-400 mb-5">Distribution across resource categories</p>
          {loading ? <div className="h-60 bg-gray-100 rounded-xl animate-pulse" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
                <Legend iconType="circle" iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-1">Resources by Building</h2>
          <p className="text-xs text-gray-400 mb-5">Number of resources per building</p>
          {loading ? <div className="h-60 bg-gray-100 rounded-xl animate-pulse" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={28}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Resources" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent resources table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-50">
          <div>
            <h2 className="font-bold text-gray-900">Recently Added</h2>
            <p className="text-xs text-gray-400 mt-0.5">5 most recently added resources</p>
          </div>
          <button onClick={() => navigate('/admin/manage')}
            className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
            View all <ArrowRight size={13} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Type', 'Location', 'Status', 'Date Added'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-gray-50 animate-pulse">
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-5 py-3.5"><div className="h-3.5 bg-gray-100 rounded w-24" /></td>
                    ))}
                  </tr>
                ))
              ) : recent5.map(r => (
                <tr key={r.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/resources/${r.id}`)}>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{r.name}</td>
                  <td className="px-5 py-3.5"><TypeBadge type={r.type} /></td>
                  <td className="px-5 py-3.5 text-gray-500">{r.location}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-3.5 text-gray-400">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && recent5.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">No resources yet</div>
          )}
        </div>
      </div>

      <ResourceFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreate} />
    </div>
    </ResourceAdminGate>
  );
};
