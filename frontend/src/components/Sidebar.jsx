import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, LayoutDashboard, List, PlusCircle, CalendarDays } from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header" onClick={() => { navigate('/'); toggleSidebar && toggleSidebar(); }}>
                <Calendar className="brand-icon" />
                <span className="brand-name">SmartCampus</span>
            </div>

            <div className="sidebar-nav">
                <span className="nav-group-title">Menu</span>
                {user?.role === 'ADMIN' ? (
                    <>
                        <NavLink to="/admin/dashboard" className="nav-item" onClick={toggleSidebar}>
                            <LayoutDashboard size={20} /> Dashboard
                        </NavLink>
                        <NavLink to="/admin/bookings" className="nav-item" onClick={toggleSidebar}>
                            <List size={20} /> All Bookings
                        </NavLink>
                        <NavLink to="/admin/calendar" className="nav-item" onClick={toggleSidebar}>
                            <CalendarDays size={20} /> Master Calendar
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/bookings/my" className="nav-item" onClick={toggleSidebar}>
                            <List size={20} /> My Bookings
                        </NavLink>
                        <NavLink to="/bookings/new" className="nav-item" onClick={toggleSidebar}>
                            <PlusCircle size={20} /> New Booking
                        </NavLink>
                    </>
                )}
            </div>
        </aside>
    );
}
