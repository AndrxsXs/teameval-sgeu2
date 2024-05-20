/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import LogoutButton from './auth/LogoutButton';
import Skeleton from '@mui/joy/Skeleton';

const USER_ROLES = {
    ADMIN: 'Admin',
    TEACHER: 'Docente',
    STUDENT: 'Estudiante',
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

export default function ProfileInfo(props) {
    const { userData } = props;
    const [role, setRole] = useState(!userData)
    const [loading, setLoading] = useState(!userData); // Establecer loading a true inicialmente

    useEffect(() => {
        setRole(userData && interpretNumbers(userData.role));
        setLoading(false)
    }, [userData]); // El arreglo vacío asegura que el efecto se ejecute una sola vez

    return (
        <Box component="section" sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
            p: '16px'
        }}>
            <Avatar
                variant="outlined"
                size="sm"
                src=""
            />
            <Box sx={{
                //minWidth: 0,
                display: 'flex',
                // flex: 1, 
                width: '100%',
                flexDirection: 'column',
                alignContent: 'flex-start',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexWrap: 'nowrap',
            }}>
                <Typography level="title-sm">
                    <Skeleton loading={loading} animation="wave">
                        {userData && `${userData.name} ${userData.last_name}`}
                    </Skeleton>
                </Typography>
                <Typography level="body-xs">
                    <Skeleton loading={loading} animation="wave">
                        {userData && role}
                    </Skeleton>
                </Typography>
            </Box>
            <LogoutButton />
        </Box>
    );
}