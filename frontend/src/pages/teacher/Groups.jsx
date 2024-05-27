import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Box } from "@mui/joy"
import { Typography } from "@mui/joy"
import { Button } from "@mui/joy"
import Add from '@mui/icons-material/Add';
import GroupsTable from "../../components/teacher/groups/GroupsTable";

export default function Groups() {
    return (
        <>
            <Box
                component="header"
                sx={{
                    display: 'flex',
                    mt: 4, // Aumentamos el margen superior (mt)
                    mb: 2, // Aumentamos el margen inferior (mb)
                    gap: 1,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'start', sm: 'center' },
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                <Typography level="h2" component="h1">
                    Grupos
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}
                >
                    <Button color="primary" startDecorator={<Add />} size="sm">
                        Crear grupos
                    </Button>
                </Box>
            </Box>
            <Box sx={{ mt: 1 }}>
                <GroupsTable />
            </Box>
        </>
    );
}