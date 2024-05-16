import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../components/auth/AuthContext';

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import LogoutButton from './auth/LogoutButton';
import Skeleton from '@mui/joy/Skeleton';

export default function ProfileInfo() {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(!user); // Establecer loading a true inicialmente

    useEffect(() => {
        // Simular un retraso de 2 segundos para obtener los datos del usuario
        const timeout = setTimeout(() => {
            setLoading(false); // Establecer loading a false después de obtener los datos del usuario
        }, 1000);

        return () => clearTimeout(timeout); // Limpiar el timeout en el desmontaje
    }, [user]); // El arreglo vacío asegura que el efecto se ejecute una sola vez

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
                        {user && `${user.name} ${user.lastName}`}
                    </Skeleton>
                </Typography>
                <Typography level="body-xs">
                    <Skeleton loading={loading} animation="wave">
                        {user && user.email}
                    </Skeleton>
                </Typography>
            </Box>
            <LogoutButton />
        </Box>
    );
}