import { Box, Sheet, Typography } from "@mui/joy"
import { Link } from 'react-router-dom';
import { Button } from "@mui/joy"
import CreateStudent from "../../../components/teacher/CreateStudent";
import BodyAddStudent from "../../../components/teacher/BodyAddStudent";
import FileUploadIcon from '@mui/icons-material/FileUpload';
export default function AddStudent() {

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
                    Nombre del curso
                </Typography>

                <Box
                    sx={{

                        display: 'flex',
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}
                >

                    <CreateStudent />

                    <Link to="subir">
                        <Button color="primary" startDecorator={<FileUploadIcon />}>
                            Subir estudiantes
                        </Button>
                    </Link>

                </Box>
                <BodyAddStudent />
            </Box>


        </>
    )
}