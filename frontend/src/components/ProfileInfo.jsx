import { useEffect, useState } from 'react';
import axios from 'axios';

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

export default function ProfileInfo() {

    const [userData, setUserData] = useState({});

    useEffect(() => {
        axios.get('/api/user_data/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    if (userData.name) {
        console.log(userData.name);
    }

    return (

        <Box component="section" sx={{ display: 'flex', gap: 1, alignItems: 'center', p: '16px' }}>
            <Avatar
                variant="outlined"
                size="sm"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography level="title-sm">David Márquez</Typography>
                <Typography level="body-xs">david.m@test.com</Typography>
            </Box>
            <IconButton size="sm" variant="plain" color="neutral" component="a" href="/logout">
                <LogoutRoundedIcon />
            </IconButton>
        </Box>

    )
}