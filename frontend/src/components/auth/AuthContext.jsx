/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import api from '../../api';
import { ACCESS_TOKEN } from '../../constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            api.get('api/user_data/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(userInfo => {
                // console.log(userInfo);
                setUser({
                    name: userInfo.data.name,
                    lastName: userInfo.data.last_name,
                    email: userInfo.data.email,
                    role: userInfo.data.role,
                });
            });
        }
    }, []);

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};