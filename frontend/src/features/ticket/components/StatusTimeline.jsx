import React from 'react';
import { Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';

const StatusTimeline = ({ history }) => {
    return (
        <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
            {history.map((item, index) => (
                <div key={index} className="flex gap-6 relative">
                    <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm flex-shrink-0 z-10 ${
                        index === 0 ? 'bg-indigo-600 scale-110' : 'bg-slate-300'
                    }`}></div>
                    <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-slate-800">{item.status}</span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{item.note}</p>
                        <p className="text-[10px] text-slate-400 mt-1">Action by: {item.changedBy}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatusTimeline;
