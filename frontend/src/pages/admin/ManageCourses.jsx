import { Box } from "@mui/joy"
import { Typography } from "@mui/joy"
import { Button } from "@mui/joy"
import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function ManageCourses() {

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
                    Configuración de Cursos
                </Typography>

                <Button
                    color="primary"
                    startDecorator={<AddRoundedIcon />}
                    size="sm"
                >
                    Nuevo curso
                </Button>
            </Box>
        </>
    )
}