import { Routes, Route } from 'react-router-dom'

import { Box } from "@mui/joy"
import { CssVarsProvider } from "@mui/joy/styles"
import CssBaseline from "@mui/joy/CssBaseline"
import TeacherSidebar from "../../../components/teacher/TeacherSidebar"

import AddStudent from './AddStudent'
import DisableStudent from "../course/DisableStudent"
import Groups from '../Groups'
import ScalesCriteria from '../ScalesCriteria'
import Report from '../Report'

function CourseView() {
    return (
        <>
            <CssVarsProvider disableTransitionOnChange>
                <Box className="container" sx={{}}>
                    <CssBaseline />
                    <TeacherSidebar />

                    <Box component="main" className="main-container"
                        sx={{
                            px: { xs: 2, md: 6 },
                            pt: {
                                xs: 'calc(12px + var(--Header-height))',
                                sm: 'calc(12px + var(--Header-height))',
                                md: 3,
                            },
                            pb: { xs: 2, sm: 2, md: 3 },
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: 0,
                            height: '100dvh',
                            gap: 1,
                        }}>
                        <Routes>
                            <Route path='/curso/estudiante/importar' element={<AddStudent />} />
                            <Route path='/curso/estudiante/deshabilitar' element={<DisableStudent />} />
                            <Route path='/curso/grupos' element={<Groups />} />
                            <Route path='/curso/escalas' element={<ScalesCriteria />} />
                            <Route path='/curso/informe' element={<Report />} />
                        </Routes>
                    </Box>
                </Box>
            </CssVarsProvider >
        </>
    )

}

export default CourseView