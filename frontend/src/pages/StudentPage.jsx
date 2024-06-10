/* eslint-disable react/prop-types */
import { CssVarsProvider } from "@mui/joy/styles"
import CssBaseline from "@mui/joy/CssBaseline"
import { Outlet } from 'react-router-dom'
import StudentSidebar from "../components/student/StudentSidebar"
import "../styles/pages/student/StudentPage.css"
import { Box } from '@mui/material';
// import Breadcrumbs from '@mui/joy/Breadcrumbs';
// import Link from '@mui/joy/Link';
// import Typography from '@mui/joy/Typography';
// import PublicIcon from '@mui/icons-material/Public';
// import Feedback from "../pages/student/Feedback";
// import Grades from "../pages/student/Grades";
// import Result from "../pages/student/Result";


export default function StudentPage({ userData }) {
    return (
        <CssVarsProvider disableTransitionOnChange>
            <Box className="container" sx={{ width: '100%' }}>
                <CssBaseline />
                <StudentSidebar userData={userData} />

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



                    <Outlet />
                </Box>
            </Box>
        </CssVarsProvider >
    );
}