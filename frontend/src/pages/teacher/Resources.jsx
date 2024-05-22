import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Box } from "@mui/joy"
import { Typography } from "@mui/joy"
import ImportResources from '../../components/teacher/import/ImportResources';

export default function Resources() {

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
                    Recursos
                </Typography>
            </Box>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column', // Asegura que los elementos estén en columna
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh', // Establece la altura 
                width: '70vw', // Establece el ancho al 100% del viewport
                gap: 2, // Ajuste para separar los elementos
            }}>
                <Typography level="body-md">
                    No hay recursos disponibles en el momento
                </Typography>

                <ImportResources />
            </Box>
        </>
    )
}
