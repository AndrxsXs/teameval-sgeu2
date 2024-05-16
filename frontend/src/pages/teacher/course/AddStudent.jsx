import { Box, Typography } from "@mui/joy"
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Button } from "@mui/joy"
import Add from '@mui/icons-material/Add';
import CreateStudent from "../../../components/teacher/CreateStudent";

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
                    <Button
                        
                        color="primary"
                        startDecorator= {<FileUploadIcon />}
                        size="sm"
                    >
                        Importar estudiantes
                    </Button>
                </Box>
                
            </Box>
        </>
    )
}