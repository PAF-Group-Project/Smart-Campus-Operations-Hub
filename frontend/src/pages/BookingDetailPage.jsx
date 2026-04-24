import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import QRCodeModal from '../components/QRCodeModal';
import { Calendar, Clock, MapPin, User, FileText, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import './Detail.css';

export default function BookingDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showQR, setShowQR] = useState(false);

    const fetchBooking = async () => {
        try {
            const res = await bookingService.getBookingById(id);
            setBooking(res.data);
        } catch (err) {
            console.error(err);
            setError('Booking not found or you don\'t have permission to view it.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleApprove = async () => {
        if (!window.confirm('Approve this booking?')) return;
        
        setBooking(prev => ({ ...prev, status: 'APPROVED' }));
        try {
            await bookingService.updateStatus(id, 'APPROVED');
            fetchBooking();
        } catch (err) {
            console.error(err);
            fetchBooking();
            alert('Failed to approve booking.');
        }
    };

    const handleReject = async () => {
        const reason = window.prompt("Please provide a reason for rejection:");
        if (reason === null) return; 
        if (!reason.trim()) return alert("Rejection reason is required.");
        
        setBooking(prev => ({ ...prev, status: 'REJECTED', rejectionReason: reason }));
        try {
            await bookingService.updateStatus(id, 'REJECTED', reason);
            fetchBooking();
        } catch (err) {
            console.error(err);
            fetchBooking();
            alert('Failed to reject booking.');
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        
        setBooking(prev => ({ ...prev, status: 'CANCELLED' }));
        try {
            await bookingService.cancelBooking(id);
            fetchBooking();
        } catch (err) {
            console.error(err);
            fetchBooking();
            alert('Failed to cancel booking.');
        }
    };

    if (loading) return <div className="loader">Loading Details...</div>;
    if (error) return <div className="page-container"><div className="alert alert-danger">{error}</div></div>;
    if (!booking) return null;

    const isAdmin = user?.role === 'ADMIN';
    const isOwner = user?.id === booking.userId;

    return (
        <div className="page-container">
            <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Back
            </button>
            
            <div className="detail-layout">
                <div className="glass-panel detail-main">
                    <div className="detail-header">
                        <div>
                            <h1 className="detail-title">{booking.purpose}</h1>
                            <span className="text-muted">Booking Reference: {booking.id}</span>
                        </div>
                        <span className={`badge badge-${booking.status.toLowerCase()}`}>
                            {booking.status}
                        </span>
                    </div>

                    <div className="detail-grid">
                        <div className="detail-item">
                            <MapPin size={20} className="detail-icon" />
                            <div>
                                <label>Resource</label>
                                <p>{booking.resourceId}</p>
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <Calendar size={20} className="detail-icon" />
                            <div>
                                <label>Date</label>
                                <p>{booking.date}</p>
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <Clock size={20} className="detail-icon" />
                            <div>
                                <label>Time Box</label>
                                <p>{booking.startTime} - {booking.endTime}</p>
                            </div>
                        </div>

                        <div className="detail-item">
                            <User size={20} className="detail-icon" />
                            <div>
                                <label>Requested By</label>
                                <p>{booking.userName} ({booking.userEmail})</p>
                                <p className="text-muted">ID: {booking.userId}</p>
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <User size={20} className="detail-icon" />
                            <div>
                                <label>Attendees</label>
                                <p>{booking.expectedAttendees} expected</p>
                            </div>
                        </div>
                    </div>

                    {booking.rejectionReason && (
                        <div className="alert alert-danger mt-4">
                            <strong>Rejection Reason:</strong> {booking.rejectionReason}
                        </div>
                    )}
                </div>

                <div className="glass-panel detail-actions">
                    <h3>Actions</h3>
                    
                    <div className="action-stack">
                        {isAdmin && booking.status === 'PENDING' && (
                            <>
                                <button className="btn btn-primary" onClick={handleApprove}>
                                    <CheckCircle size={16}/> Approve Booking
                                </button>
                                <button className="btn btn-danger" onClick={handleReject}>
                                    <XCircle size={16}/> Reject Booking
                                </button>
                            </>
                        )}

                        {isOwner && (booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                            <button className="btn btn-danger" onClick={handleCancel}>
                                <XCircle size={16}/> Cancel Booking
                            </button>
                        )}

                        {booking.status === 'APPROVED' && (isAdmin || isOwner) && (
                            <button className="btn btn-secondary" onClick={() => setShowQR(true)}>
                                Show Check-in QR
                            </button>
                        )}
                        
                        {!((isAdmin && booking.status === 'PENDING') || 
                           (isOwner && (booking.status === 'PENDING' || booking.status === 'APPROVED')) || 
                           booking.status === 'APPROVED') && (
                            <p className="text-muted text-center pt-2">No actions available for this state.</p>
                        )}
                    </div>
                </div>
            </div>

            {showQR && (
                <QRCodeModal 
                    token={booking.qrCodeToken} 
                    booking={booking}
                    onClose={() => setShowQR(false)} 
                />
            )}
        </div>
    );
}
