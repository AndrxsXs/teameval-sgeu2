/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../constants";
import { useState, useEffect } from "react";
import { CircularProgress, Box, Typography } from "@mui/joy";
import AdminPage from "../../pages/AdminPage";
import TeacherPage from "../../pages/TeacherPage";
import StudentPage from "../../pages/StudentPage";

const USER_ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
};

const interpretNumbers = (nums) => {
    switch (nums) {
        case 1:
            return USER_ROLES.STUDENT;
        case 2:
            return USER_ROLES.TEACHER;
        case 3:
            return USER_ROLES.ADMIN;
        default:
            return null;
    }
};

const ProtectedRoute = ({ allowedRoles }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [userData, setUserData] = useState(null);
    const location = useLocation();
    const token = localStorage.getItem(ACCESS_TOKEN);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                setIsAuthorized(false);
                return;
            }

            const decoded = jwtDecode(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;

            if (tokenExpiration < now) {
                await refreshToken();
            }

            try {
                const res = await api.get('api/user_data/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserData(res.data);

                const userRole = interpretNumbers(decoded.role);

                if (allowedRoles.includes(userRole)) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (error) {
                console.log(error);
                setIsAuthorized(false);
            }
        };

        fetchUserData();
    }, [allowedRoles, token]);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post('/api/token/refresh/', {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
            } else {
                // Manejar el caso en que el refresh token no sea válido
                localStorage.clear();
                window.location.href = '/login'; // Redirigir al usuario a la página de inicio de sesión
            }
        } catch (error) {
            console.log(error);
            localStorage.clear();
            window.location.href = '/login'; // Redirigir al usuario a la página de inicio de sesión
        }
    };

    if (isAuthorized === null) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', justifyContent: 'center', height: '100dvh' }}>
                <CircularProgress size="lg" />
                <Typography level="body-sm">
                    Cargando...
                </Typography>
            </Box>
        );
    }

    if (isAuthorized) {
        const userRole = interpretNumbers(userData.role);
        switch (userRole) {
            case USER_ROLES.ADMIN:
                return <AdminPage userData={userData} />;
            case USER_ROLES.TEACHER:
                return <TeacherPage userData={userData} />;
            case USER_ROLES.STUDENT:
                return <StudentPage userData={userData} />;
            default:
                return null;
        }
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;