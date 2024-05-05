import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../constants";
import { useState, useEffect } from "react";
import PropTypes from "prop-types"

export default function ProtectedRoute({ children, allowedRoles}) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        
        const allowedRoles = ["admin", "teacher", "student"];

        const auth = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (!token) {
                setIsAuthorized(false);
                return;
            }
            const decoded = jwtDecode(token);
            // console.log(decoded);
            const userRole = decoded.role;
            const isAllowed = allowedRoles.includes(userRole);

            if (!isAllowed) {
                setIsAuthorized(false);
                return;
            }

            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;

            if (tokenExpiration < now) {
                await refreshToken();
            } else {
                setIsAuthorized(true);
            }
        };

        auth().catch(() => setIsAuthorized(false))
    }, [allowedRoles])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };



    if (isAuthorized === null) {
        return <div>Cargando...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
}