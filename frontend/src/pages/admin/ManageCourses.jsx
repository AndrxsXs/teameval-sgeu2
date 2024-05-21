import { Fragment } from "react";

import { Outlet, useLocation } from "react-router-dom";

import {
    Box,
    Stack,
    Typography,
    FormControl,
    FormLabel,
    Input,
    Select,
    Option,

} from "@mui/joy"

import SearchIcon from "@mui/icons-material/Search";

import CreateCourse from "../../components/admin/CreateCourse";
import CourseTable from "../../components/CourseTable";

export default function ManageCourses() {

    const location = useLocation();
    const isCoursePage = location.pathname === ('/admin/manage/courses' || '/admin/manage/courses/');

    return (
        <Fragment>
            {isCoursePage ?
                (
                    <>
                        <Box component="header"
                            sx={{
                                display: 'flex',
                                mt: 2,
                                mb: 1,
                                gap: 1,
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'start', sm: 'center' },
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}
                        >
                            <Typography level="h2" component="h1">
                                Cursos
                            </Typography>

                            <CreateCourse />
                        </Box>
                        <Stack
                            component='section'
                            direction='row'
                            gap={2}
                            // sx={{
                            //     alignSelf: 'flex-start',
                            // }}

                            sx={{
                                alignSelf: 'flex-start',
                                minWidth: '50%',
                                borderRadius: 'sm',
                                py: 2,
                                display: { xs: 'none', sm: 'flex' },
                                flexWrap: 'nowrap',
                                justifyContent: 'flex-start',
                                gap: 1.5,
                                // '& > *': {
                                //     minWidth: { xs: '120px', md: '160px' },
                                // },
                            }}

                        >
                            <FormControl sx={{ flex: 1, maxWidth: '70%' }} size="sm">
                                <FormLabel>Buscar curso</FormLabel>
                                <Input
                                    // value={searchQuery}
                                    // onChange={handleSearchChange}
                                    size="sm"
                                    placeholder="Código, nombre, docente, etc."
                                    startDecorator={<SearchIcon />}
                                />
                            </FormControl>

                            <FormControl sx={{ flex: 1, maxWidth: '30%' }} size="sm">
                                <FormLabel>Estado</FormLabel>

                                <Select
                                    placeholder="Seleccionar"
                                >
                                    <Option value="enabled">Habilitado</Option>
                                    <Option value="disabled">Deshabilitado</Option>
                                </Select>

                            </FormControl>
                        </Stack>
                        <CourseTable />
                    </>
                )
                :
                (
                    <>
                        <Box component="header"
                            sx={{
                                display: 'flex',
                                mt: 2,
                                mb: 1,
                                gap: 1,
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'start', sm: 'center' },
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}
                        >
                            <Typography level="h2" component="h1">
                                Cursos
                            </Typography>
                            <FormControl sx={{ width: '50%' }} size="sm">
                                <Input
                                    // value={searchQuery}
                                    // onChange={handleSearchChange}
                                    // size="md"
                                    placeholder="Buscar cursos"
                                    startDecorator={<SearchIcon />}
                                />
                            </FormControl>
                            <CreateCourse />
                        </Box>
                        <Outlet />
                    </>
                )
            }
        </Fragment>
    )
}