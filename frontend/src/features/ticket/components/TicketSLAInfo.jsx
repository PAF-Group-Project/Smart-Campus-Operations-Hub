import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const TicketSLAInfo = ({ ticket }) => {
    if (!ticket) return null;

    const formatDuration = (minutes) => {
        if (minutes === null || minutes === undefined) return 'N/A';
        if (minutes < 60) return `${minutes}m`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    };

    const renderSLAStatus = (label, timestamp, duration, breached, isFinalized) => {
        let statusColor = 'text-slate-400';
        let statusBg = 'bg-slate-50';
        let icon = <Clock className="w-4 h-4" />;
        let statusText = 'Pending';

        if (timestamp) {
            if (breached) {
                statusColor = 'text-rose-600';
                statusBg = 'bg-rose-50';
                icon = <AlertCircle className="w-4 h-4" />;
                statusText = 'Breached';
            } else {
                statusColor = 'text-emerald-600';
                statusBg = 'bg-emerald-50';
                icon = <CheckCircle className="w-4 h-4" />;
                statusText = 'Within SLA';
            }
        } else if (isFinalized) {
             statusText = 'N/A';
        }

        return (
            <div className={`flex flex-col p-4 rounded-2xl border ${timestamp ? (breached ? 'border-rose-100' : 'border-emerald-100') : 'border-slate-100'} ${statusBg} space-y-2`}>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${statusColor} bg-white border border-current/10`}>
                        {icon}
                        {statusText}
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-slate-900">{timestamp ? formatDuration(duration) : '--'}</span>
                    {timestamp && (
                        <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    const isFinalized = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' || ticket.status === 'REJECTED';

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">SLA Performance</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderSLAStatus('First Response', ticket.firstResponseAt, ticket.firstResponseDuration, ticket.firstResponseSlaBreached, isFinalized)}
                {renderSLAStatus('Resolution', ticket.resolvedAt, ticket.resolutionDuration, ticket.resolutionSlaBreached, isFinalized)}
            </div>
        </div>
    );
};

export default TicketSLAInfo;
