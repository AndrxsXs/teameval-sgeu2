// CourseDetailed.jsx
import {
    // useParams,

} from 'react-router-dom';

import {
    Card,
    Stack,
    Typography,
    Button
} from '@mui/joy';

import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function CourseDetailed() {
    // const { courseCode } = useParams();

    return (
        <>
            <Card
                sx={{
                    p: 2,
                    width: 'clamp(100%, 100%, 1000px)',
                    height: '100%',

                }}
            >
                <Stack
                    className="course-details-header"
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                >
                    <Stack
                        className="course-details-info"
                    >
                        <Typography level="h2" component="h1">
                            Proyecto Integrador I
                        </Typography>
                        <Typography
                            level="body-md"
                        > <strong>Código:</strong> 1005243</Typography>
                        <Typography
                            level="body-md"
                        >
                            <strong>Docente:</strong> Juan Pérez
                        </Typography>
                    </Stack>
                    <Stack className="course-details-button-group"
                        direction="row"
                        gap={2}
                    >
                        <Button
                            startDecorator={<ArchiveRoundedIcon />}
                            variant="soft"
                            color="danger"
                        >Deshabilitar</Button>
                        <Button
                            startDecorator={<EditRoundedIcon />}
                            variant='soft'
                            color='neutral'
                        >Editar</Button>
                        <Button
                            startDecorator={<CloseRoundedIcon />}
                        >Cerrar</Button>
                    </Stack>
                </Stack>
            </Card>
        </>
    );
}