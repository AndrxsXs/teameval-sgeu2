import TopNavbar from './TopNavbar';
import '../styles/components/Sidebar.css';
import * as React from 'react';
// import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ListSubheader from '@mui/joy/ListSubheader';

import { PropTypes } from 'prop-types';

import ColorSchemeToggle from './ColorSchemeToggle';
// import { closeSidebar } from '../utils';

function Toggler({
    defaultExpanded = false,
    renderToggle,
    children,
}) {
    const [open, setOpen] = React.useState(defaultExpanded);
    return (
        <React.Fragment>
            {renderToggle({ open, setOpen })}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateRows: open ? '1fr' : '0fr',
                    transition: '0.2s ease',
                    '& > *': {
                        overflow: 'hidden',
                    },
                }}
            >
                {children}
            </Box>
        </React.Fragment>
    );
}

export default function Sidebar() {
    return (
        <Sheet
            component="aside"
            className="Sidebar"
            sx={{
                position: 'sticky',
                height: '100dvh',
                width: 'var(--Sidebar-width)',
                top: 0,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRight: '1px solid',
                borderColor: 'divider'
            }}
        >
            {/* <GlobalStyles
                styles={(theme) => ({
                    ':root': {
                        '--Sidebar-width': '250px',
                        [theme.breakpoints.up('lg')]: {
                            '--Sidebar-width': '270px',
                        },
                    },
                })}
            /> */}
            <Box
                component="header"
                className="logo-header" sx={{
                    display: 'flex',
                    gap: 1,
                    p: '16px',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}>
                {/* <IconButton variant="soft" color="primary" size="sm">
                    <BrightnessAutoRoundedIcon />
                </IconButton> */}
                <TopNavbar />
                <ColorSchemeToggle sx={{ ml: 'auto' }} />
            </Box>
            {/* <Input size="sm" startDecorator={<SearchRoundedIcon />} placeholder="Search" /> */}
            <Box
                component="nav"
                sx={{
                    minHeight: 0,
                    p: '16px',
                    pt: 0,
                    overflow: 'hidden auto',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    [`& .${listItemButtonClasses.root}`]: {
                        gap: 1.5,
                    },
                    pb: 0,
                }}
            >
                <List
                    size="sm"
                    sx={{
                        gap: 1,
                        '--List-nestedInsetStart': '30px',
                        '--ListItem-radius': (theme) => theme.vars.radius.sm,
                    }}
                >
                    <ListSubheader sx={{ letterSpacing: '2px', fontWeight: '800' }}>
                        Gestión
                    </ListSubheader>
                    <ListItem>
                        <ListItemButton selected>
                            <SupervisorAccountRoundedIcon />
                            <ListItemContent>
                                <Typography level="title-sm">Administradores</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton>
                            <SchoolRoundedIcon />
                            <ListItemContent>
                                <Typography level="title-sm">Docentes</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton>
                            <AutoStoriesRoundedIcon />
                            <ListItemContent>
                                <Typography level="title-sm">Cursos</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton>
                            <EditNoteRoundedIcon />
                            <ListItemContent>
                                <Typography level="title-sm">Escalas y criterios</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                </List>

                <List
                    size="sm"
                    sx={{
                        mt: 'auto',
                        flexGrow: 0,
                        '--ListItem-radius': (theme) => theme.vars.radius.sm,
                        '--List-gap': '8px',
                        mb: 2,
                    }}
                >
                    <ListSubheader sx={{ letterSpacing: '2px', fontWeight: '800' }}>
                        Sistema
                    </ListSubheader>
                    <ListItem>
                        <ListItemButton>
                            <SettingsRoundedIcon />
                            Ajustes
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
            <Divider
                sx={{
                    my: '-16px',
                }}
            />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', p: '16px' }}>
                <Avatar
                    variant="outlined"
                    size="sm"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography level="title-sm">David Márquez</Typography>
                    <Typography level="body-xs">david@test.com</Typography>
                </Box>
                <IconButton size="sm" variant="plain" color="neutral" component="a" href="/logout">
                    <LogoutRoundedIcon />
                </IconButton>
            </Box>
        </Sheet>

    )
}

Sidebar.propTypes = {
    prop1: PropTypes.string,
    prop2: PropTypes.number,
    prop3: PropTypes.bool,
};

Toggler.propTypes = {
    defaultExpanded: PropTypes.bool,
    renderToggle: PropTypes.func,
    children: PropTypes.node,
};