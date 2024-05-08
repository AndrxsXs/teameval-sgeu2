import TopNavbar from './TopNavbar';
import '../styles/components/Sidebar.css';
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ListSubheader from '@mui/joy/ListSubheader';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

import { PropTypes } from 'prop-types';

import ColorSchemeToggle from './ColorSchemeToggle';
import ProfileInfo from './ProfileInfo';
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

    const adminUrl = "/admin/manage/admin";
    const teacherUrl = "/admin/manage/teachers";
    const courseUrl = "/admin/manage/courses";
    const scaleUrl = "/admin/manage/scales";

    const location = useLocation();

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
                <TopNavbar session/>
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
                        <ListItemButton selected={location.pathname === adminUrl}>
                            <SupervisorAccountRoundedIcon />
                            <ListItemContent>
                                <Link to={adminUrl}>
                                    <Typography level="title-sm">Administradores</Typography>
                                </Link>
                            </ListItemContent>
                        </ListItemButton>

                    </ListItem>

                    <ListItem>
                        <ListItemButton selected={location.pathname === teacherUrl}>
                            {/* <SchoolRoundedIcon /> */}
                            <PersonRoundedIcon />
                            <ListItemContent>
                                <Link to={teacherUrl}>
                                    <Typography level="title-sm">Docentes</Typography>
                                </Link>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton selected={location.pathname === courseUrl}>
                            <AutoStoriesRoundedIcon />
                            <ListItemContent>
                                <Link to={courseUrl}>
                                    <Typography level="title-sm">Cursos</Typography>
                                </Link>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton selected={location.pathname === scaleUrl}>
                            <EditNoteRoundedIcon />
                            <ListItemContent>
                                <Link to={scaleUrl}>
                                    <Typography level="title-sm">Escalas y criterios</Typography>
                                </Link>
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
                            <ListItemContent>
                                <Link to="/admin/settings">
                                    <Typography level="title-sm">
                                        Ajustes
                                    </Typography>
                                </Link>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
            <Divider
                sx={{
                    my: '-16px',
                }}
            />
            <ProfileInfo />
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