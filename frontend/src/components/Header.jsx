import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { Search, Menu, UserCircle } from 'lucide-react';

export default function Header({ toggleSidebar }) {
    const { user, toggleRole } = useAuth();
    const { searchQuery, setSearchQuery } = useSearch();

    return (
        <header className="app-header">
            <div className="header-left">
                <button className="menu-toggle" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search resources or bookings..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="header-right">
                <div className="user-profile">
                    <div className="user-info">
                        <span className="user-name">{user?.name}</span>
                        {user?.role === 'ADMIN' ? (
                            <span className="badge badge-approved" style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>ADMIN</span>
                        ) : (
                            <span className="badge" style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>USER</span>
                        )}
                    </div>
                    <UserCircle size={32} strokeWidth={1.5} color="var(--text-secondary)" />
                </div>
                
                <button onClick={toggleRole} className="btn btn-secondary btn-sm">
                    Switch to {user?.role === 'ADMIN' ? 'USER' : 'ADMIN'}
                </button>
            </div>
        </header>
    );
}
