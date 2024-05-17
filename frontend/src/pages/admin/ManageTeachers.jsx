import { Box, Typography, Button } from '@mui/joy';

import TeacherTable from '../../components/admin/TeacherTable';
import CreateTeacher from '../../components/admin/CreateTeacher';

import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';

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
                    Docentes
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}
                >
                    <Button
                        variant="soft"
                        startDecorator={<FileUploadRoundedIcon />}
                    >
                        Importar docentes
                    </Button>
                    <CreateTeacher />
                </Box>
            </Box>
            <TeacherTable />
        </>
    )
}