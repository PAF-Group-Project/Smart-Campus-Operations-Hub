import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, XCircle, CheckCircle, RefreshCcw, ShieldCheck, MessageSquare, Send } from 'lucide-react';
import ticketApi from '../../../api/ticketApi';
import StatusBadge from '../components/StatusBadge';
import StatusTimeline from '../components/StatusTimeline';
import CommentList from '../components/CommentList';
import TicketSLAInfo from '../components/TicketSLAInfo';

const ADMIN_ID = "ADM001";
const ADMIN_NAME = "Admin User";

const AdminTicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rejecting, setRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [newComment, setNewComment] = useState('');

    const MIKE = { id: 'TECH001', name: 'Mike Johnson' };

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const fetchTicket = async () => {
        try {
            const res = await ticketApi.getTicketById(id, 'ADMIN');
            setTicket(res.data);
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || "Error fetching ticket details";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignMike = async () => {
        try {
            await ticketApi.assignTechnician(id, { technicianId: MIKE.id, technicianName: MIKE.name });
            fetchTicket();
        } catch (err) {
            alert("Assignment failed");
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            alert("Please provide a reason for rejection");
            return;
        }
        try {
            await ticketApi.rejectTicket(id, { reason: rejectReason });
            setRejecting(false);
            fetchTicket();
        } catch (err) {
            alert("Rejection failed");
        }
    };

    const handleUpdateStatus = async (status) => {
        try {
            await ticketApi.updateStatus(id, { status });
            fetchTicket();
        } catch (err) {
            alert("Status update failed");
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await ticketApi.addComment(id, {
                content: newComment,
                authorId: ADMIN_ID,
                authorName: ADMIN_NAME,
                authorRole: 'ADMIN'
            });
            setNewComment('');
            fetchTicket();
        } catch (err) {
            alert("Comment failed");
        }
    };
    
    const handleUpdateComment = async (commentId, content) => {
        try {
            await ticketApi.updateComment({ 
                ticketId: id,
                commentId: commentId,
                userId: ADMIN_ID, 
                content 
            });
            fetchTicket();
        } catch (err) {
            console.error("Update failed:", err);
            const message = err.response?.data?.message || "Failed to update comment";
            alert(message);
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Review Panel...</div>;
    
    if (error) return (
        <div className="p-10 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 text-rose-500 mb-2">
                <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{error}</h2>
            <p className="text-slate-500">This ticket has been finalized and its details are now restricted from further viewing.</p>
            <button 
                onClick={() => navigate('/admin/tickets')}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold transition-all hover:bg-slate-800 shadow-lg"
            >
                Back to Management
            </button>
        </div>
    );

    if (!ticket) return <div className="p-10 text-center text-rose-500">Ticket not found</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => navigate('/admin/tickets')}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Management Dashboard</span>
                </button>
                <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-black text-indigo-700 uppercase tracking-widest">Admin Control Center</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Core Info */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <StatusBadge status={ticket.status} />
                                    <span className="text-xs font-black text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">CAS-REF-{ticket.id.slice(-6).toUpperCase()}</span>
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 leading-tight">{ticket.title}</h1>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-3 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporter</p>
                                    <p className="font-bold text-slate-800">{ticket.reporterName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                                    <p className="font-bold text-slate-800">{ticket.location}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</p>
                                    <p className={`font-black uppercase text-sm ${ticket.priority === 'URGENT' ? 'text-rose-600' : 'text-indigo-600'}`}>{ticket.priority}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Incident Description</h3>
                                <div className="bg-slate-50 p-6 rounded-2xl text-slate-600 leading-relaxed text-sm whitespace-pre-wrap border border-slate-100/50">
                                    {ticket.description}
                                </div>
                            </div>

                            {ticket.attachments?.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Visual Evidence</h3>
                                    <div className="flex gap-4">
                                        {ticket.attachments.map((a, i) => (
                                            <div key={i} className="group relative w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 cursor-pointer">
                                                <img 
                                                    src={a.url ? (a.url.startsWith('http') ? a.url : (a.url.startsWith('/') ? `http://localhost:8080${a.url}` : a.url)) : `https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=300`}
                                                    onError={(e) => {
                                                        e.target.onerror = null; 
                                                        e.target.src = `https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=300`;
                                                    }}
                                                    alt="Attachment" 
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-[10px] text-white font-bold uppercase tracking-wider">Inspect</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Admin Comment Section */}
                            <div className="pt-8 border-t border-slate-100">
                                <CommentList 
                                    comments={ticket.comments || []} 
                                    currentUserId={ADMIN_ID}
                                    onDelete={(cid) => ticketApi.deleteComment(id, cid, ADMIN_ID).then(fetchTicket)}
                                    onUpdate={handleUpdateComment}
                                />
                                
                                <form onSubmit={handleAddComment} className="mt-6 flex gap-3">
                                    <input 
                                        type="text" 
                                        placeholder="Add an internal admin note..."
                                        className="flex-1 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button type="submit" className="bg-slate-900 text-white px-6 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                        <Send className="w-4 h-4" />
                                        <span>Post</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Decision Actions */}
                <div className="lg:col-span-4 space-y-6">
                    <TicketSLAInfo ticket={ticket} />
                    
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 sticky top-6">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Decisions & Workflow</h3>
                        
                        <div className="space-y-4">
                            <button
                                onClick={handleAssignMike}
                                disabled={ticket.assignedTechnicianId === 'TECH001'}
                                className="w-full flex items-center justify-center gap-2 p-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-100 disabled:text-emerald-400 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all shadow-md shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 active:scale-95 disabled:translate-y-0 disabled:shadow-none"
                            >
                                <UserPlus className="w-5 h-5" />
                                {ticket.assignedTechnicianId === 'TECH001' ? 'Assigned to Mike Johnson' : 'Assign Technician'}
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => handleUpdateStatus('CLOSED')}
                                    className="flex flex-col items-center justify-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-2xl hover:bg-emerald-100 transition-all border border-emerald-100 group"
                                >
                                    <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-black uppercase">Close Case</span>
                                </button>
                                <button 
                                    onClick={() => setRejecting(!rejecting)}
                                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all border group ${
                                        rejecting ? 'bg-rose-600 text-white border-rose-600' : 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100'
                                    }`}
                                >
                                    <XCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-black uppercase">{rejecting ? 'Cancel' : 'Reject Case'}</span>
                                </button>
                            </div>

                            {rejecting && (
                                <div className="space-y-3 p-4 bg-rose-50 rounded-2xl border border-rose-100 animate-in fade-in slide-in-from-top-4">
                                    <textarea 
                                        placeholder="Mandatory rejection reason..."
                                        className="w-full p-3 bg-white border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 transition-all text-sm resize-none"
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        rows="3"
                                    ></textarea>
                                    <button 
                                        onClick={handleReject}
                                        className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-all shadow-md shadow-rose-200"
                                    >
                                        Confirm Rejection
                                    </button>
                                </div>
                            )}

                            <div className="pt-6 mt-6 border-t border-slate-100 space-y-6">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Activity Audit</h3>
                                <StatusTimeline history={ticket.history || []} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTicketDetails;
