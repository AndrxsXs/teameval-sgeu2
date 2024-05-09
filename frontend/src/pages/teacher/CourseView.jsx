import { Box } from "@mui/joy"
import { CssVarsProvider } from "@mui/joy/styles"
import CssBaseline from "@mui/joy/CssBaseline"
import TeacherSidebar from "../../components/teacher/TeacherSidebar"
import "../../styles/pages/AdminPage.css"
import Typography from '@mui/joy/Typography'
import SearchStudent from "../../components/teacher/SearchStudent"
import SearchCode from "../../components/teacher/SearchCode"



function CourseView (){
    return(
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
                                Añadir estudiante
                            </Typography>  
                    </Box>
                        <SearchStudent /> 
                    </Box>   
                </Box>
            </CssVarsProvider >
        </>
    )

}

export default CourseView