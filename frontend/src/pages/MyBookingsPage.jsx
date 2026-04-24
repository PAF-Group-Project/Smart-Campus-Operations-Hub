import React, { useEffect, useState } from 'react';
import { bookingService } from '../services/api';
import QRCodeModal from '../components/QRCodeModal';
import { Calendar, Clock, MapPin, XCircle, Search } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import './Cards.css';

export default function MyBookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [qrModalToken, setQrModalToken] = useState(null);
    const [qrModalBooking, setQrModalBooking] = useState(null);
    const { searchQuery } = useSearch();

    const fetchBookings = async () => {
        try {
            console.log('Fetching my bookings...');
            const res = await bookingService.getMyBookings();
            console.log('My bookings received:', res.data.length, 'bookings');
            setBookings(res.data);
        } catch (err) {
            console.error('Failed to fetch my bookings:', err);
            console.error('Error response:', err.response?.data);
            console.error('Error status:', err.response?.status);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [user?.role]);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        
        // Optimistically update state
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
        
        try {
            console.log('Cancelling booking with ID:', id);
            await bookingService.cancelBooking(id);
            console.log('Booking cancelled successfully');
            fetchBookings(); // Refresh to get latest data
        } catch (err) {
            console.error('Failed to cancel booking:', err);
            console.error('Error response:', err.response?.data);
            console.error('Error status:', err.response?.status);
            console.error('Error message:', err.message);
            fetchBookings(); // Revert on failure
            
            if (err.response?.status === 401) {
                alert('Authentication error. Please log in again.');
            } else if (err.response?.status === 403) {
                alert('You can only cancel your own bookings.');
            } else if (err.response?.status === 404) {
                alert('Booking not found.');
            } else {
                alert(err.response?.data?.message || 'Failed to cancel booking. Please try again.');
            }
        }
    };

    const showQrCode = (booking) => {
        setQrModalBooking(booking);
        setQrModalToken(booking.qrCodeToken);
    };

    const filtered = bookings.filter(b => {
        const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q || 
            (b.purpose && b.purpose.toLowerCase().includes(q)) || 
            (b.resourceId && b.resourceId.toLowerCase().includes(q));
        return matchesStatus && matchesSearch;
    });

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">My Bookings</h1>
                
                <div className="filter-controls">
                    <select 
                        className="form-input status-filter" 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="NO_SHOW">No Show</option>
                    </select>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state glass-panel">
                    <Search size={48} className="text-muted" />
                    <h3>No Bookings Found</h3>
                    <p>You don't have any bookings matching this criteria.</p>
                </div>
            ) : (
                <div className="cards-grid">
                    {filtered.map(booking => (
                        <div key={booking.id} className="booking-card glass-panel">
                            <div className="card-header">
                                <h3>{booking.purpose}</h3>
                                <span className={`badge badge-${booking.status.toLowerCase()}`}>
                                    {booking.status}
                                </span>
                            </div>
                            
                            <div className="card-body">
                                <p><MapPin size={16}/> {booking.resourceId}</p>
                                <p><Calendar size={16}/> {booking.date}</p>
                                <p><Clock size={16}/> {booking.startTime} - {booking.endTime}</p>
                            </div>
                            
                            <div className="card-actions">
                                {booking.status === 'APPROVED' && (
                                    <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => showQrCode(booking)}
                                    >
                                        Show QR Code
                                    </button>
                                )}
                                
                                {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                                    <button 
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleCancel(booking.id)}
                                    >
                                        <XCircle size={16}/> Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {qrModalToken && (
                <QRCodeModal 
                    token={qrModalToken} 
                    booking={qrModalBooking}
                    onClose={() => setQrModalToken(null)} 
                />
            )}
        </div>
    );
}
