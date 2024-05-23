/* eslint-disable react/prop-types */
import { useEffect, useState, Fragment } from 'react';

import api from '../api';

import { useLocation, useNavigate } from 'react-router-dom';

import {
    Table,
    Sheet,
    Typography,
    Box,
    // Button,
    // Chip,
    CircularProgress,
    Button,
    // ButtonGroup
} from '@mui/joy';

import {
    // Cloud,
    // Check,
    // Cancel,

} from '@mui/icons-material'

// import SearchField from './admin/SearchField';
import EditCourse from './EditCourse';
// import DisableCourse from './DisableCourse';

function RowMenu(props) {

    const { course } = props;

    return (

        <Box
            // size='sm'
            sx={{ display: 'flex', gap: 1 }}
        >
            <EditCourse course={course} />
            <OpenDetails
                route={course.code}
            />
            {/* <DisableCourse course={course} /> */}

        </Box>
    )
}

// const LinkableRow = ({ to, children }) => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     const handleClick = () => {
//         const newPath = `${location.pathname}/${to}`;
//         navigate(newPath);
//     };

//     return (
//         <tr onClick={handleClick} style={{ cursor: 'pointer' }}>
//             {children}
//         </tr>
//     );
// };

const OpenDetails = ({ route }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        const newPath = `${location.pathname}/${route}`;
        navigate(newPath);
    };

    return (
        <>
            <Button
                disabled
                onClick={handleClick}
                variant='soft'
                color='primary'
            >
                Detalles
            </Button>
        </>
    );
};

// function openCourseDetails(course) {

//     navigate = useNavigate();

//     return (
//         <>
//             <Button
//                 onClick={navigate(`/course/${course.code}`)}
//                 variant='soft'
//                 color='primary'
//             >
//                 <Typography level='body-xs'>Detalles</Typography>
//             </Button>
//         </>
//     )
// }

export default function CourseTable() {

    // const testCourses = [
    //     {
    //         code: '0870',
    //         name: 'Proyecto Integrador I',
    //         teacher: {
    //             code: '2020',
    //             name: 'Juan',
    //             last_name: 'Perez',
    //             email: 'juan.perez@mail.edu.co',
    //             phone: '',
    //         },
    //         academic_period: '2024-1',
    //     },
    //     {
    //         code: '0871',
    //         name: 'Desarrollo de software II',
    //         teacher: {
    //             code: '2021',
    //             name: 'David',
    //             last_name: 'Marquez',
    //             email: '',
    //             phone: '',
    //         },
    //         academic_period: '2024-1',
    //     }
    // ]

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('ACCESS_TOKEN');
            const response = await api.get('api/course_list/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCourses(response.data);
            // console.log('Cursos:', response.data);
        } catch (error) {
            window.dispatchEvent(
                new CustomEvent('responseEvent', {
                    detail: {
                        message: `${error.response.status} ${error.response.statusText}`,
                        severity: 'danger',
                    },
                })
            );
            // console.error('Error obteniendo datos de cursos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();

        // Escuchar el evento 'courseCreated'
        const handleCourseCreated = () => {
            fetchCourses(); // Llamar a la función para obtener la lista actualizada de cursos
        };

        window.addEventListener('courseCreated', handleCourseCreated);

        // Limpiar el evento al desmontar el componente
        return () => {
            window.removeEventListener('courseCreated', handleCourseCreated);
        };
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
                    aria-labelledby="Tabla de cursos"
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
                            // <LinkableRow to={row.code} key={row.code}>
                            <tr key={row.code}>
                                <td style={{ paddingInline: '16px' }}>
                                    <Typography level="body-xs">{row.code}</Typography>
                                </td>
                                <td style={{ paddingInline: '16px' }}>
                                    <Typography level="body-xs">{row.name}</Typography>
                                </td>
                                <td style={{ paddingInline: '16px' }}>
                                    <Typography level="body-xs">{row.academic_period}</Typography>
                                </td>
                                <td style={{ paddingInline: '16px' }}>
                                    <Typography level="body-xs">
                                        {row.teacher}
                                    </Typography>
                                </td>
                                <td style={{ paddingInline: '16px' }}>
                                    <RowMenu course={row} />
                                </td>
                            </tr>
                            // </LinkableRow>
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
