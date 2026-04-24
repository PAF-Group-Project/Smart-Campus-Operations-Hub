import React, { useEffect, useState } from 'react';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Activity, Clock, CheckCircle, XCircle } from 'lucide-react';
import './Dashboard.css';

const COLORS = {
    PENDING: '#fbbf24',
    APPROVED: '#34d399',
    REJECTED: '#ef4444',
    CANCELLED: '#94a3b8',
    NO_SHOW: '#f97316'
};

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

export default function AdminDashboardPage() {
    const { user, setAdminRole } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ensure user is ADMIN before fetching
    useEffect(() => {
        if (user && user.role !== 'ADMIN') {
            console.log('Setting ADMIN role for dashboard page');
            setAdminRole();
        }
    }, [user, setAdminRole]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            // Wait until user role is ADMIN
            if (!user || user.role !== 'ADMIN') {
                console.log('Dashboard: Waiting for ADMIN role...');
                return;
            }

            try {
                console.log('Fetching analytics data...');
                console.log('User role:', user.role);
                const res = await bookingService.getAnalytics();
                console.log('Analytics data received:', res.data);
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
                console.error('Error response:', err.response?.data);
                console.error('Error status:', err.response?.status);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    alert('Authentication error. Please refresh the page and try again.');
                } else {
                    alert('Failed to load analytics. Please check the console for details.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [user?.role]);

    if (loading) return <div className="loader">Loading Dashboard...</div>;
    if (!stats) return <div className="loader">Failed to load analytics data</div>;

    // Transform statusCounts into PieChart format
    const statusData = Object.entries(stats.statusCounts || {}).map(([name, value]) => ({
        name, value 
    }));

    // Transform topResources into BarChart format
    const topResourcesData = Object.entries(stats.topResources || {}).map(([name, count]) => ({
        name, count
    }));

    // Transform dayOfWeekCounts into LineChart format
    const dayOfWeekData = Object.entries(stats.dayOfWeekCounts || {}).map(([name, count]) => ({
        name, count
    }));

    // Order days of week logically if possible (Simple sort for demo purposes by generic map won't work perfectly for string Day names naturally, but Recharts handles it in order of insertion if derived predictably)
    
    return (
        <div className="page-container">
            <h1 className="page-title">Analytics Dashboard</h1>
            
            <div className="stats-grid">
                <div className="stat-card glass-panel">
                    <div className="stat-icon bg-blue"><Activity size={24} /></div>
                    <div className="stat-info">
                        <h3>Total Bookings</h3>
                        <p className="stat-value">{stats.totalBookings}</p>
                    </div>
                </div>
                
                <div className="stat-card glass-panel">
                    <div className="stat-icon bg-yellow"><Clock size={24} /></div>
                    <div className="stat-info">
                        <h3>Pending Requests</h3>
                        <p className="stat-value">{stats.statusCounts?.PENDING || 0}</p>
                    </div>
                </div>
                
                <div className="stat-card glass-panel">
                    <div className="stat-icon bg-green"><CheckCircle size={24} /></div>
                    <div className="stat-info">
                        <h3>Approved</h3>
                        <p className="stat-value">{stats.statusCounts?.APPROVED || 0}</p>
                    </div>
                </div>
                
                <div className="stat-card glass-panel">
                    <div className="stat-icon bg-red"><XCircle size={24} /></div>
                    <div className="stat-info">
                        <h3>Rejected</h3>
                        <p className="stat-value">{stats.statusCounts?.REJECTED || 0}</p>
                    </div>
                </div>
            </div>

            <div className="charts-grid mt-4">
                <div className="chart-container glass-panel width-2-span">
                    <h3 className="chart-title">Bookings per Day of Week</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dayOfWeekData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="var(--text-secondary)" />
                            <YAxis stroke="var(--text-secondary)" />
                            <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none' }} />
                            <Line type="monotone" dataKey="count" stroke="var(--accent-primary)" strokeWidth={3} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container glass-panel">
                    <h3 className="chart-title">Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#64748b'} />
                                ))}
                            </Pie>
                            <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container glass-panel width-2-span">
                    <h3 className="chart-title">Top 5 Most Booked Resources</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topResourcesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="var(--text-secondary)" />
                            <YAxis stroke="var(--text-secondary)" />
                            <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                            <Bar dataKey="count" fill="var(--accent-primary)" radius={[4, 4, 0, 0]}>
                                {topResourcesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
