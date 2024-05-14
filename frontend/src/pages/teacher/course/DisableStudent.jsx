import { Box, Typography } from "@mui/joy"
import SearchStudent from "../../../components/teacher/SearchStudent"

export default function DisableStudent() {

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
                    Deshabilitar estudiante
                </Typography>
            </Box>
            <SearchStudent />
        </>
    )
}