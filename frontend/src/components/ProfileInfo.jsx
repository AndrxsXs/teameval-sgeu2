import { useContext } from 'react';
import { AuthContext } from '../components/auth/AuthContext';

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

export default function ProfileInfo() {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <div>Cargando...</div>; // O cualquier otro componente de carga que prefieras
    }

    return (
        <Box component="section" sx={{ display: 'flex', gap: 1, alignItems: 'center', p: '16px' }}>
            <Avatar
                variant="outlined"
                size="sm"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography level="title-sm">{`${user.name} ${user.lastName}`}</Typography>
                <Typography level="body-xs">{user.email}</Typography>
            </Box>
            <IconButton size="sm" variant="plain" color="neutral" component="a" href="/logout">
                <LogoutRoundedIcon />
            </IconButton>
        </Box>
    );
}