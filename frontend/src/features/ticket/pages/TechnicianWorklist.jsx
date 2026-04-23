import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, ChevronRight, MapPin, AlertCircle } from 'lucide-react';
import ticketApi from '../../../api/ticketApi';
import StatusBadge from '../components/StatusBadge';

const TECH_ID = "TECH001";

const TechnicianWorklist = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssigned = async () => {
            try {
                const res = await ticketApi.getTechnicianTickets(TECH_ID);
                setTickets(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAssigned();
    }, []);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 font-sans">
            <div className="bg-slate-900 p-8 rounded-[2rem] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl shadow-slate-200">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-widest">
                        <Briefcase className="w-4 h-4" />
                        Professional Worklist
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Assigned Tasks</h1>
                    <p className="text-slate-400 text-sm">Managing your current campus maintenance queue</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] uppercase font-black text-slate-500">Active Tasks</p>
                        <p className="text-2xl font-black">{tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length}</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse"></div>)}
                </div>
            ) : tickets.length > 0 ? (
                <div className="space-y-4">
                    {tickets.map(ticket => (
                        <Link 
                            key={ticket.id} 
                            to={`/technician/tickets/${ticket.id}`}
                            className="group block bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-between"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black transition-colors ${
                                    ticket.priority === 'URGENT' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'
                                }`}>
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <StatusBadge status={ticket.status} />
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">#{ticket.id.slice(-6)}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{ticket.title}</h3>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {ticket.location}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner border border-slate-100">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">No tasks currently assigned to your queue.</p>
                </div>
            )}
        </div>
    );
};

export default TechnicianWorklist;
