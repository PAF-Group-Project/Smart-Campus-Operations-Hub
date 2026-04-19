import React, { useState } from 'react';
import { Trash2, Edit3, MessageSquare } from 'lucide-react';

const CommentList = ({ comments, currentUserId, onDelete }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
                Comments ({comments.length})
            </h3>
            
            {comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                        {comment.authorName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{comment.authorName}</p>
                                        <p className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleString()} • {comment.authorRole}</p>
                                    </div>
                                </div>
                                
                                {comment.authorId === currentUserId && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => onDelete(comment.id)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed ml-10">
                                {comment.content}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-slate-400 italic text-sm">
                    No comments yet. Start the conversation!
                </div>
            )}
        </div>
    );
};

export default CommentList;
