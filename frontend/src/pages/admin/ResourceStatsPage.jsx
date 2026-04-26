import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getResourceStats, getAllResources } from '../../services/resourceService';
import toast from 'react-hot-toast';
import { ResourceAdminGate } from '../../components/facilities/ResourceAdminGate';

const PIE_STATUS_COLORS = ['#10b981', '#ef4444', '#f59e0b'];
const PIE_TYPE_COLORS   = ['#6366f1', '#8b5cf6', '#f97316', '#6b7280'];
const BAR_CAP_COLORS    = ['#6366f1', '#8b5cf6', '#f97316', '#10b981'];

const ChartCard = ({ title, subtitle, children, loading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <h2 className="font-bold text-gray-900 mb-0.5">{title}</h2>
    <p className="text-xs text-gray-400 mb-5">{subtitle}</p>
    {loading ? <div className="h-64 bg-gray-100 rounded-xl animate-pulse" /> : children}
  </div>
);

export const ResourceStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, resourcesRes] = await Promise.all([getResourceStats(), getAllResources()]);
        setStats(statsRes?.data ?? statsRes);
        setResources(Array.isArray(resourcesRes) ? resourcesRes : (resourcesRes?.data || []));
      } catch {
        toast.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusData = stats ? [
    { name: 'Active', value: stats.activeCount || 0 },
    { name: 'Out of Service', value: stats.outOfServiceCount || 0 },
    { name: 'Maintenance', value: stats.underMaintenanceCount || 0 },
  ] : [];

  const typeData = stats ? [
    { name: 'Labs', count: stats.countByType?.LAB || 0 },
    { name: 'Lecture Halls', count: stats.countByType?.LECTURE_HALL || 0 },
    { name: 'Meeting Rooms', count: stats.countByType?.MEETING_ROOM || 0 },
    { name: 'Equipment', count: stats.countByType?.EQUIPMENT || 0 },
  ] : [];

  // Capacity ranges
  const capRanges = [
    { label: '0–30', min: 0, max: 30 },
    { label: '31–60', min: 31, max: 60 },
    { label: '61–100', min: 61, max: 100 },
    { label: '100+', min: 101, max: Infinity },
  ];
  const capacityData = capRanges.map(r => ({
    name: r.label,
    count: resources.filter(x => x.capacity != null && x.capacity >= r.min && x.capacity <= r.max).length,
  }));

  return (
    <ResourceAdminGate>
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Resource Statistics</h1>
        <p className="text-gray-500 text-sm mt-1">Visual overview of all campus resources</p>
      </div>

      {/* Summary numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats?.totalResources, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Active', value: stats?.activeCount, color: 'text-green-600 bg-green-50' },
          { label: 'Out of Service', value: stats?.outOfServiceCount, color: 'text-red-600 bg-red-50' },
          { label: 'Maintenance', value: stats?.underMaintenanceCount, color: 'text-yellow-600 bg-yellow-50' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} rounded-2xl p-5 border border-white/50 shadow-sm`}>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</p>
            {value !== undefined
              ? <p className="text-4xl font-extrabold mt-1">{value}</p>
              : <div className="h-10 w-16 bg-current opacity-10 rounded animate-pulse mt-1" />}
          </div>
        ))}
      </div>

      {/* Status distribution PieChart */}
      <ChartCard title="Status Distribution" subtitle="How resources are currently distributed by status" loading={loading}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={statusData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
              {statusData.map((_, i) => <Cell key={i} fill={PIE_STATUS_COLORS[i % PIE_STATUS_COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" iconSize={10} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type BarChart */}
        <ChartCard title="Distribution by Type" subtitle="Number of resources per category" loading={loading}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={typeData} barSize={36}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="Resources" radius={[6, 6, 0, 0]}>
                {typeData.map((_, i) => <Cell key={i} fill={PIE_TYPE_COLORS[i % PIE_TYPE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Capacity Range BarChart */}
        <ChartCard title="Capacity Ranges" subtitle="Number of rooms/halls in each capacity bracket" loading={loading}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={capacityData} barSize={36}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="Resources" radius={[6, 6, 0, 0]}>
                {capacityData.map((_, i) => <Cell key={i} fill={BAR_CAP_COLORS[i % BAR_CAP_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
    </ResourceAdminGate>
  );
};
