import { Box } from "@mui/joy"
import { Typography } from "@mui/joy"
import { Button } from "@mui/joy"
import Add from '@mui/icons-material/Add';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

export default function ManageScales() {

    return (
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
                    Escalas y criterios
                </Typography>

                <Box
                sx={{

                   display: 'flex',
                   gap: 1,
                   flexDirection: { xs: 'column', sm: 'row' },                    
                }}
                >
                    <Button
                        color="primary"
                        startDecorator={<Add />}
                        size="sm"
                    >
                        Agregar criterios
                    </Button>
                    <Button
                        color="neutral"
                        variant="outlined"
                        startDecorator={<EditRoundedIcon />}
                        disabled
                    >
                        Editar criterios
                    </Button>
                </Box>
            </Box>
    )
}