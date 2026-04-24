import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Will create these next
import BookingFormPage from './pages/BookingFormPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CalendarViewPage from './pages/CalendarViewPage';

const ProtectedRoute = ({ children, requireAdmin }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/" />;
    if (requireAdmin && user.role !== 'ADMIN') return <Navigate to="/bookings/my" />;
    return children;
};

const AppRoutes = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const previousRoleRef = useRef(user?.role);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (previousRoleRef.current && previousRoleRef.current !== user?.role) {
            if (user?.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/bookings/my');
            }
        }
        previousRoleRef.current = user?.role;
    }, [user?.role, navigate]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    
    return (
        <div className="app-layout">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="main-wrapper">
                <Header toggleSidebar={toggleSidebar} />
                <main className="main-content">
                    <Routes>
                    <Route path="/" element={
                        user?.role === 'ADMIN' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/bookings/my" />
                    } />
                    
                    {/* User Routes */}
                    <Route path="/bookings/new" element={<ProtectedRoute><BookingFormPage /></ProtectedRoute>} />
                    <Route path="/bookings/my" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
                    <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetailPage /></ProtectedRoute>} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>} />
                    <Route path="/admin/bookings" element={<ProtectedRoute requireAdmin><AdminBookingsPage /></ProtectedRoute>} />
                    <Route path="/admin/calendar" element={<ProtectedRoute requireAdmin><CalendarViewPage /></ProtectedRoute>} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <SearchProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </SearchProvider>
        </AuthProvider>
    );
}
