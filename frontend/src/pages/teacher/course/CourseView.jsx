import { Outlet } from 'react-router-dom'

import { Box } from "@mui/joy"
import { CssVarsProvider } from "@mui/joy/styles"
import CssBaseline from "@mui/joy/CssBaseline"
import TeacherSidebar from "../../../components/teacher/TeacherSidebar"


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
                            <Outlet />
                       
                    </Box>
                </Box>
            </CssVarsProvider >
        </>
    )

}

export default CourseView