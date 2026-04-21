import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Send, 
    Upload, 
    X, 
    CheckCircle2, 
    AlertCircle, 
    Type, 
    MapPin, 
    AlertTriangle, 
    Camera, 
    FileText,
    Paperclip,
    ChevronDown
} from 'lucide-react';
import ticketApi from '../../../api/ticketApi';

const STUDENT_ID = "STU001";
const STUDENT_NAME = "John Doe";

const StudentCreateTicket = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        category: 'MAINTENANCE',
        priority: 'MEDIUM',
        contactDetails: '',
        reporterId: STUDENT_ID,
        reporterName: STUDENT_NAME
    });

    const categories = ['MAINTENANCE', 'IT', 'ELECTRICAL', 'PLUMBING', 'SECURITY', 'OTHER'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (files.length + selectedFiles.length > 3) {
            setError("Maximum 3 images allowed per ticket");
            return;
        }
        
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const invalid = selectedFiles.find(f => !validTypes.includes(f.type));
        if (invalid) {
            setError("Only JPEG, PNG and WEBP images are allowed");
            return;
        }

        setFiles([...files, ...selectedFiles]);
        setError(null);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await ticketApi.createTicket(formData, files);
            navigate('/student/tickets');
        } catch (err) {
            console.error("Ticket submission error:", err);
            const message = err.response?.data?.message || err.response?.data?.errors?.title || "Failed to submit ticket";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFF] p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-6 text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>

                <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 overflow-hidden">
                    {/* Header Section */}
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-4">
                            <Send className="w-3 h-3" />
                            Submit Request
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-3">
                            Create a new incident or maintenance ticket
                        </h1>
                        <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
                            Use clear details so the facilities team can understand the issue quickly and respond with less back-and-forth.
                        </p>
                    </div>

                    {/* Action Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm border border-blue-50">
                                <Type className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Clear Title</h3>
                                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Name the specific issue and place.</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-50">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Exact Location</h3>
                                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Floor, room, or nearby landmark.</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50 flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-500 shadow-sm border border-amber-50">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Impact Level</h3>
                                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Mention if it affects safety or access.</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100/50 flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-purple-500 shadow-sm border border-purple-50">
                                <Camera className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Visual Proof</h3>
                                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Attach a photo to help remotely.</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* First Row: Title & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Title <span className="text-rose-500">*</span></label>
                                <input 
                                    type="text"
                                    placeholder="Water leak near Library staircase"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[14px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                                    value={formData.title}
                                    required
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Location <span className="text-rose-500">*</span></label>
                                <input 
                                    type="text"
                                    placeholder="Science Block, Floor 2, Room 211"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[14px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                                    value={formData.location}
                                    required
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Second Row: Category & Priority */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Category <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <select 
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[14px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer pr-10"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Priority <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <select 
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[14px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer pr-10"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                    >
                                        {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Description</label>
                            <textarea 
                                rows="5"
                                placeholder="Describe the issue, when you noticed it, and whether it affects teaching, safety, or student access."
                                className="w-full px-4 py-4 bg-white border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-300"
                                value={formData.description}
                                required
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            ></textarea>
                            <p className="text-[11px] text-slate-400 pl-1">
                                Explain what happened, when you noticed it, and whether it affects safety, access, or teaching.
                            </p>
                        </div>

                        {/* Attachments */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-700">Optional attachments</h3>
                            
                            <div className="flex flex-wrap gap-4">
                                {files.map((file, i) => (
                                    <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-100 group shadow-sm bg-slate-50">
                                        <img 
                                            src={URL.createObjectURL(file)} 
                                            alt="preview" 
                                            className="w-full h-full object-cover"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="absolute top-1.5 right-1.5 bg-white/90 hover:bg-rose-500 hover:text-white text-rose-500 p-1 rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                                
                                {files.length < 3 && (
                                    <label className="flex-1 min-w-[280px] h-16 border-2 border-dashed border-slate-200 rounded-[14px] hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group flex items-center px-4 gap-3 bg-slate-50/50">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-500 shadow-sm transition-colors border border-slate-100">
                                            <Paperclip className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">Add an image or supporting file</span>
                                        </div>
                                        <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all">
                                            Browse
                                        </div>
                                        <input type="file" hidden accept="image/*" multiple onChange={handleFileChange} />
                                    </label>
                                )}
                            </div>
                            <p className="text-[11px] text-slate-400 pl-1">
                                Attach up to 3 photos or documents (Max 10MB each).
                            </p>
                        </div>

                        {/* Footer Section */}
                        <div className="pt-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <p className="text-[13px] text-slate-400">
                                Required fields are marked with <span className="text-rose-500 font-bold">*</span>
                            </p>
                            
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 active:scale-95 disabled:translate-y-0 min-w-[200px] justify-center"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Submit request
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentCreateTicket;
