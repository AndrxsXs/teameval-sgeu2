import { Box } from "@mui/joy"
import { Typography } from "@mui/joy"
import SearchField from "../../components/admin/SearchField"
import CreateAdmin from "../../components/admin/CreateAdmin"

export default function ManageAdmin() {

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
                    Configuración de administradores
                </Typography>

                <CreateAdmin />
            </Box>
            <SearchField />
        </>
    )
}