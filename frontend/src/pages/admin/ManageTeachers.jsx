import { Box, Typography, Button } from '@mui/joy';
import Add from '@mui/icons-material/Add';

export default function ManageTeachers() {
    return (
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
                    Configuración de docentes
                </Typography>

                <Button
                    color="primary"
                    startDecorator={<Add />}
                >
                    Nuevo docente
                </Button>


            </Box>
        </>
    )
}