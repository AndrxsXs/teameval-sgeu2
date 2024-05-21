/* eslint-disable react/prop-types */
import { Link, useLocation } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import ProfileInfo from './ProfileInfo';
import DropdownMenu from './DropdownMenu';

import '../styles/components/Sidebar.css';

import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ListSubheader from '@mui/joy/ListSubheader';

import ColorSchemeToggle from './ColorSchemeToggle';

const MenuItem = ({ icon, text, route, isSelected }) => (
    <ListItem>
        <ListItemButton selected={isSelected}>
            {icon}
            <ListItemContent>
                <Link to={route}>
                    <Typography level="title-sm">{text}</Typography>
                </Link>
            </ListItemContent>
        </ListItemButton>
    </ListItem>
);

export default function Sidebar(props) {
    const { userData } = props;

    const {
        firstHeader,
        menuItems,
        settingsRoute,
        showDropdownMenu,
        dropdownMenuProps,
        dropdownMenuPosition,
    } = props;

    const location = useLocation();

    return (
        <Sheet
            component="aside"
            className="Sidebar"
            sx={{
                position: 'sticky',
                height: '100dvh',
                // width: 'var(--Sidebar-width)',
                // width: 'max-content',
                width: '100%',
                maxWidth: '300px',
                top: 0,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRight: '1px solid',
                borderColor: 'divider'
            }}
        >
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
                <TopNavbar session />
                <ColorSchemeToggle sx={{ ml: 'auto' }} />
            </Box>
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
                        {firstHeader}
                    </ListSubheader>
                    {menuItems && menuItems.map(({ text, route, icon }, index) => {
                        if (index === dropdownMenuPosition && showDropdownMenu) {
                            return <DropdownMenu key={index} {...dropdownMenuProps} />;
                        }

                        return (
                            <MenuItem
                                key={index}
                                icon={icon}
                                text={text}
                                route={route}
                                isSelected={location.pathname === (route || `${route}/`)}
                            />
                        );
                    })}
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
                        <ListItemButton selected={location.pathname === settingsRoute}>
                            <SettingsRoundedIcon />
                            <ListItemContent>
                                <Link to={settingsRoute}>
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
            <ProfileInfo userData={userData} />
        </Sheet>
    )
}