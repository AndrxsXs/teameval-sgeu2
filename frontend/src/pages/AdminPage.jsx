import { CssVarsProvider } from "@mui/joy/styles"
import CssBaseline from "@mui/joy/CssBaseline"
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from "../components/AdminSidebar"
import ManageTeachers from "../pages/admin/ManageTeachers"
import "../styles/pages/AdminPage.css"
import Box from '@mui/material/Box'
import ManageAdmin from "./admin/ManageAdmin";
import ManageCourses from "./admin/ManageCourses";
import ManageScales from "./admin/ManageScales";

function AdminPage() {
    return (
        <>
            <CssVarsProvider disableTransitionOnChange>
                <Box className="container" sx={{width: '100%'}}>
                    <CssBaseline />
                    <AdminSidebar />

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
                            height: '100dvh',
                            width: '100%',
                            gap: 1,
                            margin: 'auto 0',
                        }}>

                        <Routes>
                            <Route path='/manage/admin' element={<ManageAdmin />} />
                            <Route path='/manage/teachers' element={<ManageTeachers />} />
                            <Route path='/manage/courses' element={<ManageCourses />} />
                            <Route path='/manage/scales' element={<ManageScales />} />
                        </Routes>

                    </Box>
                </Box>
            </CssVarsProvider >
        </>
    )
}

export default AdminPage