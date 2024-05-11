/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from '../../constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            const decodedToken = jwtDecode(token);
            setUser({
                name: decodedToken.name,
                lastName: decodedToken.last_name,
                email: decodedToken.email,
                role: decodedToken.role,
            });
        }
    }, []);

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};