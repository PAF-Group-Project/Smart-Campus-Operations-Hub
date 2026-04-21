import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/tickets';

const ticketApi = {
    createTicket: async (ticketData, files) => {
        const formData = new FormData();
        formData.append('ticket', new Blob([JSON.stringify(ticketData)], { type: 'application/json' }));
        if (files) {
            files.forEach(file => formData.append('attachments', file));
        }
        return axios.post(API_BASE_URL, formData);
    },

    getAllTickets: () => axios.get(API_BASE_URL),
    
    getStudentTickets: (studentId) => axios.get(`${API_BASE_URL}/student/${studentId}`),
    
    getTechnicianTickets: (technicianId) => axios.get(`${API_BASE_URL}/technician/${technicianId}`),
    
    getTicketById: (id, role) => axios.get(`${API_BASE_URL}/${id}${role ? `?role=${role}` : ''}`),
    
    assignTechnician: (id, technicianData) => axios.patch(`${API_BASE_URL}/${id}/assign`, technicianData),
    
    rejectTicket: (id, reasonData) => axios.patch(`${API_BASE_URL}/${id}/reject`, reasonData),
    
    updateStatus: (id, statusData) => axios.patch(`${API_BASE_URL}/${id}/status`, statusData),
    
    addComment: (id, commentData) => axios.post(`${API_BASE_URL}/${id}/comments`, commentData),
    
    deleteComment: (ticketId, commentId, userId) => 
        axios.delete(`${API_BASE_URL}/${ticketId}/comments/${commentId}?userId=${userId}`)
};

export default ticketApi;
