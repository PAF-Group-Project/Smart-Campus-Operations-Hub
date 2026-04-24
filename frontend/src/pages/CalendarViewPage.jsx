import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { bookingService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Calendar.css'; 

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarViewPage() {
    const navigate = useNavigate();
    const { user, setAdminRole } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());

    // Ensure user is ADMIN before fetching
    useEffect(() => {
        if (user && user.role !== 'ADMIN') {
            console.log('Setting ADMIN role for calendar page');
            setAdminRole();
        }
    }, [user, setAdminRole]);

    useEffect(() => {
        const fetchBookings = async () => {
            // Wait until user role is ADMIN
            if (!user || user.role !== 'ADMIN') {
                console.log('Calendar: Waiting for ADMIN role...');
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching bookings for calendar...');
                console.log('User role:', user.role);
                // Fetch all bookings for visual calendar
                const res = await bookingService.getAllBookings({});
                console.log('Calendar bookings received:', res.data.length, 'bookings');
                
                const mappedEvents = res.data.map(booking => {
                    try {
                        // booking.date is 'yyyy-MM-dd', startTime is 'HH:mm'
                        // Create date objects with proper parsing
                        const startLocal = new Date(`${booking.date}T${booking.startTime}:00`);
                        const endLocal = new Date(`${booking.date}T${booking.endTime}:00`);
                        
                        // Validate dates
                        if (isNaN(startLocal.getTime()) || isNaN(endLocal.getTime())) {
                            console.warn('Invalid date for booking:', booking);
                            return null;
                        }
                        
                        console.log(`Mapped event: ${booking.purpose} on ${booking.date} from ${booking.startTime} to ${booking.endTime}`);
                        
                        return {
                            id: booking.id,
                            title: `${booking.purpose} - ${booking.resourceId}`,
                            start: startLocal,
                            end: endLocal,
                            status: booking.status,
                            resource: booking.resourceId
                        };
                    } catch (err) {
                        console.error('Error mapping booking to event:', booking, err);
                        return null;
                    }
                }).filter(event => event !== null); // Remove any null entries
                
                console.log('Total mapped events:', mappedEvents.length);
                setEvents(mappedEvents);
            } catch (err) {
                console.error('Failed to fetch bookings for calendar:', err);
                console.error('Error response:', err.response?.data);
                console.error('Error status:', err.response?.status);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    alert('Authentication error. Please refresh the page and try again.');
                } else {
                    alert('Failed to load calendar events. Please check the console for details.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user]);
// Refactored calendar view for member 2
    const eventStyleGetter = (event) => {
        let backgroundColor = 'var(--accent-primary)';
        switch(event.status) {
            case 'PENDING': backgroundColor = '#fbbf24'; break;
            case 'APPROVED': backgroundColor = '#34d399'; break;
            case 'REJECTED': backgroundColor = '#ef4444'; break;
            case 'CANCELLED': backgroundColor = '#94a3b8'; break;
            case 'NO_SHOW': backgroundColor = '#f97316'; break;
            default: break;
        }
        //resolve data mapping issue in calendar view
        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.9,
                color: 'white',
                border: 'none',
                display: 'block',
                fontWeight: 500,
                padding: '2px 5px',
                fontSize: '0.85rem'
            }
        };
    };

    const handleSelectEvent = (event) => {
        navigate(`/bookings/${event.id}`);
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Master Calendar</h1>
            
            <div className="glass-panel calendar-wrapper">
                {loading ? (
                    <div className="loader">Loading Calendar...</div>
                ) : (
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 750 }}
                        eventPropGetter={eventStyleGetter}
                        onSelectEvent={handleSelectEvent}
                        views={['month', 'week', 'day']}
                        view={view}
                        onView={setView}
                        date={date}
                        onNavigate={setDate}
                    />
                )}
            </div>
            
            <div className="legend mt-4 glass-panel legend-panel">
                <span className="legend-item"><div className="legend-dot" style={{backgroundColor: '#fbbf24'}}></div> Pending</span>
                <span className="legend-item"><div className="legend-dot" style={{backgroundColor: '#34d399'}}></div> Approved</span>
                <span className="legend-item"><div className="legend-dot" style={{backgroundColor: '#ef4444'}}></div> Rejected</span>
                <span className="legend-item"><div className="legend-dot" style={{backgroundColor: '#94a3b8'}}></div> Cancelled</span>
            </div>
        </div>
    );
}
// Finalized calendar rendering logic
