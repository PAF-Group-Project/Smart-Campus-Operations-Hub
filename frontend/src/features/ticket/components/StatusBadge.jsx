import React from 'react';

const StatusBadge = ({ status }) => {
    const statusStyles = {
        OPEN: 'bg-blue-100 text-blue-700 border-blue-200',
        IN_PROGRESS: 'bg-amber-100 text-amber-700 border-amber-200',
        RESOLVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        CLOSED: 'bg-slate-100 text-slate-700 border-slate-200',
        REJECTED: 'bg-rose-100 text-rose-700 border-rose-200'
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-slate-100 text-slate-700'}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
