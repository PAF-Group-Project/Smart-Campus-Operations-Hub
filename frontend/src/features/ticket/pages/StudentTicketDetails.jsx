import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, Tag, Send, AlertCircle } from 'lucide-react';
import ticketApi from '../../../api/ticketApi';
import StatusBadge from '../components/StatusBadge';
import StatusTimeline from '../components/StatusTimeline';
import CommentList from '../components/CommentList';

const STUDENT_ID = "STU001";
const STUDENT_NAME = "John Doe";

const StudentTicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [sendingComment, setSendingComment] = useState(false);

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const fetchTicket = async () => {
        try {
            const response = await ticketApi.getTicketById(id);
            setTicket(response.data);
        } catch (error) {
            console.error("Error fetching ticket:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSendingComment(true);
        try {
            await ticketApi.addComment(id, {
                content: newComment,
                authorId: STUDENT_ID,
                authorName: STUDENT_NAME,
                authorRole: 'STUDENT'
            });
            setNewComment('');
            fetchTicket();
        } catch (error) {
            alert("Failed to add comment");
        } finally {
            setSendingComment(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await ticketApi.deleteComment(id, commentId, STUDENT_ID);
            fetchTicket();
        } catch (error) {
            alert("Failed to delete comment");
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse text-slate-400">Loading ticket details...</div>;
    if (!ticket) return <div className="p-10 text-center text-rose-500">Ticket not found</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 font-sans pb-20">
            <button 
                onClick={() => navigate('/student/tickets')}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to List</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <StatusBadge status={ticket.status} />
                                    <span className="text-xs font-mono text-slate-400">#{ticket.id.slice(-8)}</span>
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900">{ticket.title}</h1>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 pb-6 border-b border-slate-50">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                                <Tag className="w-4 h-4 text-indigo-500" />
                                <span className="font-medium">{ticket.category}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                                <MapPin className="w-4 h-4 text-indigo-500" />
                                <span className="font-medium">{ticket.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                <span className="font-medium">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-900">Description</h3>
                            <p className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 whitespace-pre-wrap">
                                {ticket.description}
                            </p>
                        </div>

                        {ticket.attachments && ticket.attachments.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-900">Attachments</h3>
                                <div className="flex flex-wrap gap-4">
                                    {ticket.attachments.map((file, i) => (
                                        <div key={i} className="group relative w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in">
                                            <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=200" alt="Attachment" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-[10px] text-white font-bold uppercase tracking-wider">View</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {ticket.resolutionNotes && (
                            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl space-y-2">
                                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <h3>Resolution Summary</h3>
                                </div>
                                <p className="text-emerald-600 text-sm leading-relaxed">{ticket.resolutionNotes}</p>
                            </div>
                        )}
                        
                        {ticket.status === 'REJECTED' && ticket.rejectionReason && (
                            <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl space-y-2">
                                <div className="flex items-center gap-2 text-rose-700 font-bold">
                                    <AlertCircle className="w-5 h-5" />
                                    <h3>Rejection Reason</h3>
                                </div>
                                <p className="text-rose-600 text-sm leading-relaxed">{ticket.rejectionReason}</p>
                            </div>
                        )}
                    </div>

                    {/* Comments */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                        <CommentList 
                            comments={ticket.comments || []} 
                            currentUserId={STUDENT_ID}
                            onDelete={handleDeleteComment}
                        />

                        <form onSubmit={handleAddComment} className="relative">
                            <textarea 
                                placeholder="Add a comment or question..."
                                className="w-full p-4 pr-14 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-sm"
                                rows="3"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            ></textarea>
                            <button 
                                type="submit"
                                disabled={sendingComment || !newComment.trim()}
                                className="absolute bottom-3 right-3 p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl transition-all shadow-lg shadow-indigo-100"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar - Timeline & Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-slate-900">Technician Information</h3>
                        {ticket.assignedTechnicianId ? (
                            <div className="flex items-center gap-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                                    {ticket.assignedTechnicianName.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{ticket.assignedTechnicianName}</p>
                                    <p className="text-xs text-slate-500">Assigned Technician</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 text-slate-400 italic text-sm">
                                Not yet assigned
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-slate-900">Activity History</h3>
                        <StatusTimeline history={ticket.history || []} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentTicketDetails;
