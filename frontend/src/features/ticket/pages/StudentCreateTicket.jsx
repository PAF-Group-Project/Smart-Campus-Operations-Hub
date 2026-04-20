import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';
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
        
        // Validate types
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
            if (err.response) {
                console.error("Response data:", err.response.data);
                console.error("Response status:", err.response.status);
            }
            const message = err.response?.data?.message || err.response?.data?.errors?.title || "Failed to submit ticket";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6 font-sans pb-20">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group mb-4"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to List</span>
            </button>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white">
                    <h1 className="text-2xl font-bold">Report an Incident</h1>
                    <p className="text-indigo-100 mt-1">Provide details about the maintenance or IT issue</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-center gap-3 animate-shake">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Category</label>
                                <select 
                                    className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium appearance-none"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Priority</label>
                                <select 
                                    className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                >
                                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Issue Title</label>
                            <input 
                                type="text"
                                placeholder="Short summary of the problem"
                                className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                                value={formData.title}
                                required
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Location / Resource</label>
                            <input 
                                type="text"
                                placeholder="Building, Room Number or Asset ID"
                                className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                                value={formData.location}
                                required
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Detailed Description</label>
                            <textarea 
                                rows="4"
                                placeholder="Please explain exactly what happened..."
                                className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                                value={formData.description}
                                required
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Contact Details (Optional)</label>
                            <input 
                                type="text"
                                placeholder="Email or Phone for follow-up"
                                className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                                value={formData.contactDetails}
                                onChange={(e) => setFormData({...formData, contactDetails: e.target.value})}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Attachments (Max 3)</label>
                            <div className="flex flex-wrap gap-3">
                                {files.map((file, i) => (
                                    <div key={i} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                                        <img 
                                            src={URL.createObjectURL(file)} 
                                            alt="preview" 
                                            className="w-full h-full object-cover"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="absolute top-1 right-1 bg-white hover:bg-rose-500 hover:text-white text-rose-500 p-1 rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                {files.length < 3 && (
                                    <label className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all flex flex-col items-center justify-center cursor-pointer group">
                                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 mb-1" />
                                        <span className="text-[10px] text-slate-400 group-hover:text-indigo-500 font-medium">Upload</span>
                                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Submit Ticket
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentCreateTicket;
