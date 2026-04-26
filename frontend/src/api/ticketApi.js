import api from './axios';

const TICKET_BASE = '/tickets';

const ticketApi = {
    createTicket: async (ticketData, files) => {
        const formData = new FormData();
        formData.append('ticket', new Blob([JSON.stringify(ticketData)], { type: 'application/json' }));
        if (files) {
            files.forEach(file => formData.append('attachments', file));
        }
        return api.post(TICKET_BASE, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    getAllTickets: () => api.get(TICKET_BASE),
    
    getStudentTickets: () => api.get(`${TICKET_BASE}/my`),
    
    getTechnicianTickets: () => api.get(`${TICKET_BASE}/assigned`),
    
    getTicketById: (id, role) => api.get(`${TICKET_BASE}/${id}${role ? `?role=${role}` : ''}`),
    
    assignTechnician: (id, technicianData) => api.patch(`${TICKET_BASE}/${id}/assign`, technicianData),
    
    rejectTicket: (id, reasonData) => api.patch(`${TICKET_BASE}/${id}/reject`, reasonData),
    
    updateStatus: (id, statusData) => api.patch(`${TICKET_BASE}/${id}/status`, statusData),
    
    addComment: (id, commentData) => api.post(`${TICKET_BASE}/${id}/comments`, commentData),
    
    deleteComment: (ticketId, commentId, userId) => 
        api.delete(`${TICKET_BASE}/${ticketId}/comments/${commentId}?userId=${userId}`),

    updateComment: (ticketId, commentId, userId, newContent) => 
        api.patch(`${TICKET_BASE}/${ticketId}/comments/${commentId}`, { content: newContent, userId })
};

export default ticketApi;
