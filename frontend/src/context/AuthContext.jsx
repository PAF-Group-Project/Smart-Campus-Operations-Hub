/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Default to USER role for general flow
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('mockUser');
        if (stored) return JSON.parse(stored);
        
        return {
            id: 'USR-101',
            email: 'student@sliit.lk',
            name: 'John Doe',
            role: 'USER'
        };
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('mockUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('mockUser');
        }
    }, [user]);

    // Simple toggle for testing purposes
    const toggleRole = () => {
        let newUser;
        if (user.role === 'USER') {
            newUser = {
                id: 'ADM-999',
                email: 'admin@sliit.lk',
                name: 'System Admin',
                role: 'ADMIN'
            };
        } else {
            newUser = {
                id: 'USR-101',
                email: 'student@sliit.lk',
                name: 'John Doe',
                role: 'USER'
            };
        }
        setUser(newUser);
        localStorage.setItem('mockUser', JSON.stringify(newUser));
    };

    // Force set to ADMIN role
    const setAdminRole = () => {
        const adminUser = {
            id: 'ADM-999',
            email: 'admin@sliit.lk',
            name: 'System Admin',
            role: 'ADMIN'
        };
        setUser(adminUser);
        localStorage.setItem('mockUser', JSON.stringify(adminUser));
    };

    // Force set to USER role
    const setUserRole = () => {
        const normalUser = {
            id: 'USR-101',
            email: 'student@sliit.lk',
            name: 'John Doe',
            role: 'USER'
        };
        setUser(normalUser);
        localStorage.setItem('mockUser', JSON.stringify(normalUser));
    };

    return (
        <AuthContext.Provider value={{ user, toggleRole, setAdminRole, setUserRole, logout: () => setUser(null) }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
