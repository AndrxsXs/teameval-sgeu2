import React, { useEffect, useState } from 'react';

import api from '../api';

import Divider from '@mui/joy/Divider';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
// import { Skeleton } from '@mui/joy';

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { ACCESS_TOKEN } from '../constants';

function RowMenu() {
    return (
        <Dropdown>
            <MenuButton
                // slots={{ root: IconButton }}
                // slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
                variant='pain'
                color='neutral'
                size='sm'
            >
                <MoreHorizRoundedIcon />
            </MenuButton>
            <Menu size="sm" sx={{ minWidth: 140 }}>
                <MenuItem>
                    <EditRoundedIcon />
                    Editar
                </MenuItem>
                <Divider />
                <MenuItem color="danger">
                    <DisabledByDefaultRoundedIcon />
                    Deshabilitar</MenuItem>
            </Menu>
        </Dropdown>
    )
}

export default function AdminTable() {

    const [rows, setRows] = useState([]);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        // setLoading(true);
        const token = localStorage.getItem(ACCESS_TOKEN);

        api.get('api/user_list/',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    role: 3
                },
            }).then(userList => {
                // const filteredUsers = userList.data.filter(user => user.role === 3);
                setRows(userList.data);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                // setLoading(false);
            });
    }, []);

    // console.log(rows);

    // const [user, setUser] = React.useState("desc")
    // const [selected, setSelected] = React.useState([])

    return (
        <React.Fragment>
            <Sheet
                className="TableContainer"
                variant="outlined"
                sx={{
                    display: { xs: "none", sm: "initial" },
                    width: "100%",
                    borderRadius: "sm",
                    flexShrink: 1,
                    overflow: "auto",
                    minHeight: 0
                }}
            >
                <Table
                    aria-labelledby="Tabla de administradores"
                    stickyHeader
                    hoverRow
                    sx={{
                        "--TableCell-headBackground":
                            "var(--joy-palette-background-level1)",
                        "--Table-headerUnderlineThickness": "1px",
                        "--TableRow-hoverBackground":
                            "var(--joy-palette-background-level1)",
                        "--TableCell-paddingY": "4px",
                        "--TableCell-paddingX": "8px",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ width: 120, padding: "12px 16px" }}>
                                Cédula
                            </th>
                            <th style={{ width: 140, padding: "12px 6px" }}>Nombre</th>
                            <th style={{ width: 140, padding: "12px 6px" }}>Correo electrónico</th>
                            <th style={{ width: 140, padding: "12px 6px" }}>Estado</th>
                            <th style={{ width: 140, padding: "12px 6px" }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <tr key={row.code}>
                                <td style={{ paddingLeft: '16px' }}>
                                    <Typography level="body-xs">{row.code}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-xs">{row.name} {''} {row.last_name}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-xs">{row.email}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-xs">{row.status}</Typography>
                                </td>
                                <td>
                                    <RowMenu />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet>
        </React.Fragment >
    )
}
