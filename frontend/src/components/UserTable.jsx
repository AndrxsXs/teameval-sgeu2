/* eslint-disable react/prop-types */
import React, { useEffect, useState, Fragment } from 'react';

import api from '../api';

import {
    Table,
    Sheet,
    Typography,
    Box,
    // Button,
    Chip,
    CircularProgress,
    // ButtonGroup
} from '@mui/joy';

import {
    Cloud,
    Check,
    Cancel,

} from '@mui/icons-material'

import { ACCESS_TOKEN } from '../constants';

import { userStatus } from '../utils/userStatus';

import SearchField from './admin/SearchField';
import EditUser from '../components/EditUser';
import DisableUser from '../components/DisableUser';

function RowMenu(props) {

    const { user } = props;

    return (

        <Box
            // size='sm'
            sx={{ display: 'flex', gap: 1 }}
        >
            <EditUser user={user} />
            <DisableUser user={user} />

        </Box>
    )
}

export default function UserTable(props) {
    const { role, columns } = props;
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc');
    const [filters, setFilters] = useState({
        name: null,
        last_name: null,
        email: null,
        status: null,
    });

    const handleSearchChange = (searchQuery) => {
        // Lógica de filtrado basada en la consulta de búsqueda
        const fetchData = () => {
            setLoading(true);
            const token = localStorage.getItem(ACCESS_TOKEN);

            api.get('api/user_list/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    role: role,
                    name: filters.name,
                    last_name: filters.last_name,
                    email: filters.email,
                    status: filters.status,
                },
            })
                .then((userList) => {
                    const filteredRows = userList.data.filter((user) => {
                        const { code, name, last_name, email, status } = user;
                        const searchableFields = `${code} ${name} ${last_name} ${email} ${status}`.toLowerCase();
                        return searchableFields.includes(searchQuery.toLowerCase());
                    });

                    const sortedRows = filteredRows
                        .map((user) => {
                            return {
                                code: user.code,
                                name: user.name,
                                last_name: user.last_name,
                                email: user.email,
                                status: userStatus(user.status),
                            };
                        })
                        .sort((a, b) => (sortOrder === 'asc' ? a.code - b.code : b.code - a.code));
                    setRows(sortedRows);
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        fetchData();
    };

    useEffect(() => {
        const fetchData = () => {
            setLoading(true);
            const token = localStorage.getItem(ACCESS_TOKEN);

            api.get('api/user_list/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    role: role,
                },
            })
                .then((userList) => {
                    const filteredRows = userList.data.filter((user) => {
                        const { code, name, last_name, email, status } = user;
                        const searchableFields = `${code} ${name} ${last_name} ${email} ${status ? 'true' : 'false'}`.toLowerCase();

                        const matchesFilters =
                            (!filters.name || name.toLowerCase().includes(filters.name.toLowerCase())) &&
                            (!filters.last_name || last_name.toLowerCase().includes(filters.last_name.toLowerCase())) &&
                            (!filters.email || email.toLowerCase().includes(filters.email.toLowerCase())) &&
                            (!filters.status || (status ? 'true' : 'false') === filters.status);

                        return matchesFilters;
                    });

                    const sortedRows = filteredRows
                        .map((user) => {
                            return {
                                code: user.code,
                                name: user.name,
                                last_name: user.last_name,
                                email: user.email,
                                status: userStatus(user.status),
                            };
                        })
                        .sort((a, b) => (sortOrder === 'asc' ? a.code - b.code : b.code - a.code));
                    setRows(sortedRows);
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        fetchData();

        const handleUserCreated = () => {
            fetchData();
        };

        window.addEventListener('userCreated', handleUserCreated);

        return () => {
            window.removeEventListener('userCreated', handleUserCreated);
        };
    }, [role, sortOrder, filters]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    // console.log(rows);

    // const [user, setUser] = React.useState("desc")
    // const [selected, setSelected] = React.useState([])

    return (
        <React.Fragment>
            <SearchField onSearchChange={handleSearchChange} />
            <Sheet
                className="TableContainer"
                variant="outlined"
                sx={{
                    display: { xs: "none", sm: "flex" },
                    flexFlow: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "100%",
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
                            {columns && columns.map((column, index) => (
                                <th key={index} style={{
                                    padding: "12px 16px",
                                    width: "200px",
                                    maxWidth:
                                        column === "Cédula" ? "55px"
                                            :
                                            column === "Código" ? "55px"
                                                :
                                                column === "Estado" ? "70px"
                                                    :
                                                    column === "Correo electrónico" ? "150px"
                                                        :
                                                        "140px"
                                }}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <tr key={row.code}>
                                <td style={{ paddingInline: '16px' }}>
                                    <Typography level="body-xs">{row.code}</Typography>
                                </td>
                                <td style={{ paddingInline: '16px' }}>
                                    <Typography level="body-xs">{row.name} {''} {row.last_name}</Typography>
                                </td>
                                <td style={{ paddingInline: '16px' }}>
                                    <Typography level="body-xs">{row.email}</Typography>
                                </td>
                                <td style={{ paddingInline: '16px' }}>
                                    {/* <Typography level="body-xs">{row.status}</Typography> */}
                                    {row.status === 'Habilitado' ?
                                        <Chip
                                            color='success'
                                            size="sm"
                                        // startDecorator={<Check />}
                                        >{row.status}</Chip>
                                        :
                                        <Chip
                                            color='danger'
                                            size="sm"
                                        // startDecorator={<Cancel />}
                                        >{row.status}</Chip>}
                                </td>
                                <td style={{ paddingInline: '16px' }}>
                                    <RowMenu user={row} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            minHeight: '41px',
                            borderTop: rows && rows.length < 1 ? 'transparent' : '1px solid',
                            borderTopColor: 'divider',
                        }}
                    >
                        <CircularProgress size='md' />
                        <Typography
                            level='body-xs'
                            sx={{ userSelect: 'none' }}
                        >
                            <Fragment>
                                Cargando datos...
                            </Fragment>
                        </Typography>
                    </Box>
                ) :
                    <Typography
                        component='span'
                        level='body-xs'
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            minHeight: '41px',
                            borderTop: rows && rows.length < 1 ? 'transparent' : '1px solid',
                            borderTopColor: 'divider',
                            userSelect: 'none',
                        }}
                    >
                        {rows && rows.length === 0 ? <Fragment>No hay usuarios</Fragment> : <Fragment>Nada más por aquí</Fragment>}
                    </Typography>
                }
            </Sheet>
        </React.Fragment >
    )
}
