import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, History, MessageSquare, Send, Save, Activity } from 'lucide-react';
import ticketApi from '../../../api/ticketApi';
import StatusBadge from '../components/StatusBadge';
import StatusTimeline from '../components/StatusTimeline';
import CommentList from '../components/CommentList';
import TicketSLAInfo from '../components/TicketSLAInfo';

import { useAuth } from '../../../context/AuthContext';

const TechnicianTicketDetails = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [status, setStatus] = useState('');
    const [newComment, setNewComment] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const fetchTicket = async () => {
        if (!user) return;
        try {
            const res = await ticketApi.getTicketById(id, user.role);
            setTicket(res.data);
            setResolutionNotes(res.data.resolutionNotes || '');
            setStatus(res.data.status);
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || "Error fetching ticket details";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await ticketApi.updateStatus(id, { 
                status, 
                resolutionNotes 
            });
            await fetchTicket();
            alert("Update saved successfully!");
        } catch (err) {
            alert("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;
        try {
            await ticketApi.addComment(id, {
                content: newComment,
                authorId: user.id,
                authorName: user.name,
                authorRole: user.role
            });
            setNewComment('');
            fetchTicket();
        } catch (err) {
            alert("Comment failed");
        }
    };

    const handleUpdateComment = async (commentId, content) => {
        if (!user) return;
        try {
            await ticketApi.updateComment(id, commentId, user.id, content);
            fetchTicket();
        } catch (err) {
            console.error("Update failed:", err);
            const message = err.response?.data?.message || "Failed to update comment";
            alert(message);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading task details...</div>;
    
    if (error) return (
        <div className="p-10 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 text-rose-500 mb-2">
                <Activity className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{error}</h2>
            <p className="text-slate-500">This ticket has been closed or is no longer accessible.</p>
            <button 
                onClick={() => navigate('/technician/tickets')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold transition-all hover:bg-indigo-700 shadow-lg shadow-indigo-100"
            >
                Back to Worklist
            </button>
        </div>
    );

    if (!ticket) return <div className="p-10 text-center text-rose-500">Ticket not found</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
            <button 
                onClick={() => navigate('/technician/tickets')}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Worklist</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Info Display */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={ticket.status} />
                                    <span className="text-xs font-black text-slate-300">#{ticket.id.slice(-6).toUpperCase()}</span>
                                </div>
                                <h1 className="text-3xl font-black text-slate-900">{ticket.title}</h1>
                                <p className="text-sm text-slate-500 font-medium">Reported by <span className="text-indigo-600 font-bold">{ticket.reporterName}</span> at <span className="font-bold">{ticket.location}</span></p>
                            </div>
                        </div>

                        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100/50">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Incident Brief</h3>
                            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">{ticket.description}</p>
                        </div>

                        {ticket.attachments?.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Photos</h3>
                                <div className="flex gap-3">
                                    {ticket.attachments.map((a, i) => (
                                        <div key={i} className="group relative w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in flex-shrink-0">
                                            <img 
                                                src={a.url ? (a.url.startsWith('http') ? a.url : (a.url.startsWith('/') ? `http://localhost:8080${a.url}` : a.url)) : `https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=300`} 
                                                onError={(e) => {
                                                    e.target.onerror = null; 
                                                    e.target.src = `https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=300`;
                                                }}
                                                alt="Attachment" 
                                                className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                            />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-8 border-t border-slate-50">
                            <CommentList 
                                comments={ticket.comments || []} 
                                currentUserId={user?.id}
                                onDelete={(cid) => ticketApi.deleteComment(id, cid).then(fetchTicket)}
                                onUpdate={handleUpdateComment}
                            />
                            <form onSubmit={handleAddComment} className="mt-6 flex gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Add a field update or reply..."
                                    className="flex-1 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button type="submit" className="bg-indigo-600 text-white px-6 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                                    <Send className="w-4 h-4" />
                                    <span>Send</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Technician Actions Panel */}
                <div className="lg:col-span-5 space-y-6">
                    <TicketSLAInfo ticket={ticket} />
                    
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 space-y-8 sticky top-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Task Control</h3>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase ml-1">Current Status</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['IN_PROGRESS', 'RESOLVED'].map(s => (
                                        <button 
                                            key={s}
                                            type="button"
                                            onClick={() => setStatus(s)}
                                            className={`p-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${
                                                status === s 
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                                                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                                            }`}
                                        >
                                            {s === 'IN_PROGRESS' ? 'On It' : 'Finished'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase ml-1">Resolution & Progress Notes</label>
                                <textarea 
                                    className="w-full p-6 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm resize-none"
                                    rows="5"
                                    placeholder="Describe the steps taken or the final fix..."
                                    value={resolutionNotes}
                                    onChange={(e) => setResolutionNotes(e.target.value)}
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={updating}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 p-5 rounded-3xl text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
                            >
                                {updating ? <RefreshCcw className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                                {updating ? 'Syncing...' : 'Save All Updates'}
                            </button>
                        </form>

                        <div className="pt-8 border-t border-slate-100 space-y-6">
                            <div className="flex items-center gap-2 text-slate-400">
                                <History className="w-4 h-4" />
                                <h3 className="text-xs font-black uppercase tracking-widest">Audit Logs</h3>
                            </div>
                            <StatusTimeline history={ticket.history || []} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechnicianTicketDetails;
