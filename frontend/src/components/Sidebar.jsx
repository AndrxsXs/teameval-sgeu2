import '../styles/components/Sidebar.css';
import * as React from 'react';
// import GlobalStyles from '@mui/joy/GlobalStyles';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import Sheet from '@mui/joy/Sheet';
import ListSubheader from '@mui/joy/ListSubheader';

import { PropTypes } from 'prop-types';

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

export default function Sidebar(props) {

    function renderMenuItems(menuList) {
        return menuList.split(',').map((menuItem, index) => (
            <ListItem key={index}>
                <ListItemButton>
                    {menuItem}
                </ListItemButton>
            </ListItem>
        ));
    }

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
            {/* Rest of the code */}
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
                        {props.title}
                    </ListSubheader>
                    {renderMenuItems(props.menuList)}
                </List>
                {/* Rest of the code */}
            </Box>
            {/* Rest of the code */}
        </Sheet>
    );
}

Sidebar.propTypes = {
    title: PropTypes.string,
    menuList: PropTypes.string,
};

Toggler.propTypes = {
    defaultExpanded: PropTypes.bool,
    renderToggle: PropTypes.func,
    children: PropTypes.node,
};