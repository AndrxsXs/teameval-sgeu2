import { Box } from "@mui/joy"
import { Typography } from "@mui/joy"

export default function RubricResult(){
    return(
        <Box component="header" sx={{ display: 'flex', flexDirection: 'column', mt: 2, mb: 1, gap: 1, alignItems: 'start', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', overflow: 'hidden' }}>
        <Typography level="h2" component="h1">
          Resultado disponible
          
        </Typography>
        </Box>
    )
}