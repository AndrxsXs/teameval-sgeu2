/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';

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

const DropdownMenu = ({ icon, text, items }) => {
    return (
        <ListItem nested>
            <Toggler
                renderToggle={({ open, setOpen }) => (
                    <ListItemButton onClick={() => setOpen(!open)}>
                        {icon}
                        <ListItemContent>
                            <Typography level="title-sm">{text}</Typography>
                        </ListItemContent>
                        <KeyboardArrowDownIcon
                            sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                        />
                    </ListItemButton>
                )}
            >
                <List sx={{ gap: 0.5 }}>
                    {items.map(({ itemText, itemIcon, itemRoute }, index) => (
                        <ListItem key={`${itemText}-${index}`} sx={{ mt: 0.5 }}>
                            <ListItemButton>
                                {itemIcon}
                                <ListItemContent>
                                    <Link to={itemRoute}>
                                        <Typography level="title-sm">{itemText}</Typography>
                                    </Link>
                                </ListItemContent>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Toggler>
        </ListItem>
    );
};

export default DropdownMenu;