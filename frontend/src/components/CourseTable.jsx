/* eslint-disable react/prop-types */
import { useEffect, useState, Fragment } from 'react';

import api from '../api';

import {
    Table,
    Sheet,
    Typography,
    Box,
    // Button,
    // Chip,
    CircularProgress,
    // ButtonGroup
} from '@mui/joy';

import {
    // Cloud,
    // Check,
    // Cancel,

} from '@mui/icons-material'

// import SearchField from './admin/SearchField';
import EditUser from '../components/EditUser';
import DisableUser from '../components/DisableUser';

function RowMenu(props) {

    const { course } = props;

    return (

        <Box
            // size='sm'
            sx={{ display: 'flex', gap: 1 }}
        >
            <EditUser course={course} />
            <DisableUser course={course} />

        </Box>
    )
}

export default function CourseTable() {

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('ACCESS_TOKEN');
                const response = await api.get('api/course_list/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCourses(response.data);
                console.log('Cursos:', response.data);
            } catch (error) {
                console.error('Error obteniendo datos de cursos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    return (
        <Fragment>
            {/* <SearchField onSearchChange={handleSearchChange} /> */}
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
                            <th
                                style={{
                                    padding: "12px 16px",
                                    width: "200px",
                                    maxWidth: "55px",

                                }}
                            >Código</th>
                            <th
                                style={{
                                    padding: "12px 16px",
                                    width: "130px",
                                }}
                            >Nombre</th>
                            <th
                                style={{
                                    padding: "12px 16px",
                                    width: "70px",
                                }}
                            >Periodo</th>
                            <th
                                style={{
                                    padding: "12px 16px",
                                    width: "150px",
                                }}
                            >Docente Asignado</th>
                            <th
                                style={{
                                    padding: "12px 16px",
                                    width: "100px",
                                }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(row => (
                            <tr key={row.code}>
                                <td style={{ paddingInline: '16px' }}>
                                    <Typography level="body-xs">{row.code}</Typography>
                                </td>
                                <td style={{ paddingInline: '16px' }}>
                                    <Typography level="body-xs">{row.name} {''} {row.last_name}</Typography>
                                </td>
                                <td style={{ paddingInline: '16px' }}>
                                    <Typography level="body-xs">{row.teacher}</Typography>
                                </td>
                                {/* <td style={{ paddingInline: '16px' }}> */}
                                {/* <Typography level="body-xs">{row.status}</Typography> */}
                                {/* {row.status === 'Habilitado' ?
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
                                        >{row.status}</Chip>} */}
                                {/* </td> */}
                                <td>
                                    <Typography level='body-xs'>
                                        {row.academic_period}
                                    </Typography>
                                </td>
                                <td style={{ paddingInline: '16px' }}>
                                    <RowMenu course={row} />
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
                            borderTop: courses && courses.length < 1 ? 'transparent' : '1px solid',
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
                            borderTop: courses && courses.length < 1 ? 'transparent' : '1px solid',
                            borderTopColor: 'divider',
                            userSelect: 'none',
                        }}
                    >
                        {courses && courses.length === 0 ? <Fragment>No hay cursos</Fragment> : <Fragment>Nada más por aquí</Fragment>}
                    </Typography>
                }
            </Sheet>
        </Fragment >
    )
}
