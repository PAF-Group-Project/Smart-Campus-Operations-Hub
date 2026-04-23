import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Hash, User, AlertTriangle, CheckCircle2, MoreVertical, LayoutGrid, List as ListIcon } from 'lucide-react';
import ticketApi from '../../../api/ticketApi';
import StatusBadge from '../components/StatusBadge';

const AdminTicketDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await ticketApi.getAllTickets();
                setTickets(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const stats = [
        { label: 'Total Tickets', value: tickets.length, color: 'bg-indigo-500' },
        { label: 'Pending', value: tickets.filter(t => t.status === 'OPEN').length, color: 'bg-blue-500' },
        { label: 'In Progress', value: tickets.filter(t => t.status === 'IN_PROGRESS').length, color: 'bg-amber-500' },
        { label: 'High Priority', value: tickets.filter(t => t.priority === 'HIGH' || t.priority === 'URGENT').length, color: 'bg-rose-500' },
    ];

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-8 font-sans">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Operations</h1>
                    <p className="text-slate-500">Global Hub for maintenance & incident management</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <ListIcon className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-bl-full group-hover:scale-110 transition-transform`}></div>
                        <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                        <p className="text-4xl font-black text-slate-900 mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search across all modules..." 
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 shadow-inner"
                    />
                </div>
                <div className="flex gap-3 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-bold">
                        <Filter className="w-5 h-5" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* List View */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">ID</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Issue & Location</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Priority</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Assigned To</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {tickets.map(ticket => (
                                <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase">#{ticket.id.slice(-6)}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{ticket.title}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{ticket.location}</p>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                                            ticket.priority === 'URGENT' ? 'bg-rose-100 text-rose-600' :
                                            ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-600' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <StatusBadge status={ticket.status} />
                                    </td>
                                    <td className="px-6 py-5">
                                        {ticket.assignedTechnicianName ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-700">
                                                    {ticket.assignedTechnicianName.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700">{ticket.assignedTechnicianName}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs italic text-slate-300">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <Link 
                                            to={`/admin/tickets/${ticket.id}`}
                                            className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                                        >
                                            Review
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminTicketDashboard;
