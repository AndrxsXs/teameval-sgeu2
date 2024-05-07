import { CssVarsProvider } from "@mui/joy/styles"
import CssBaseline from "@mui/joy/CssBaseline"
import Sidebar from "../components/Sidebar"
import "../styles/pages/AdminPage.css"
import Typography from '@mui/joy/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/joy/Button'
import PersonAddRounded from '@mui/icons-material/PersonAddRounded';

export default function AdminPage() {
    return (
        <CssVarsProvider disableTransitionOnChange>
            <Box className="container" sx={{}}>
                <CssBaseline />
                <Sidebar />
                {/* <main className="main-container">
                <Typography level="h1" color="initial">
                    Contenido de la página de administrador
                </Typography>

            </main> */}

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

                        // flex: 1,
                        // display: 'flex',
                        // m: 0,
                        // p: 8,
                        // py: 0,
                        // flexDirection: 'column',
                        // alignItems: 'center',
                        // justifyContent: 'center',
                        // height: '100dvh',
                        // width: '100%',
                        //bgcolor: '#cdbd21',
                    }}>
                    <Box component="header"
                        sx={{
                            display: 'flex',
                            mb: 1,
                            gap: 1,
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'start', sm: 'center' },
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography level="h2" component="h1">
                            Configuración de docentes
                        </Typography>

                        <Button
                            color="primary"
                            startDecorator={<PersonAddRounded />}
                            size="sm"
                        >
                            Agregar docente
                        </Button>
                        

                    </Box>
                </Box>
            </Box>
        </CssVarsProvider >
    )
}