import { CssVarsProvider } from "@mui/joy/styles"
import CssBaseline from "@mui/joy/CssBaseline"
import { Routes, Route } from 'react-router-dom'
import StudentSidebar from "../components/student/StudentSidebar"
import Box from '@mui/material/Box'
import "../styles/pages/StudentPage.css"
import FeedBack from "../pages/student/Feedback";
import Grades from "../pages/student/Grades";
import Result from "../pages/student/Result";


export default function StudentPage() {
  return (
    <CssVarsProvider disableTransitionOnChange>
            <Box className="container" sx={{ width: '100%' }}>
                <CssBaseline />
                <StudentSidebar />

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
                        <Route path='/manage/grades' element={<Grades />} />
                        <Route path='/manage/result' element={<Result />} />
                        <Route path='/manage/feedback' element={<FeedBack />} />
                        
                    </Routes>

                </Box>
            </Box>
        </CssVarsProvider >
  );
}