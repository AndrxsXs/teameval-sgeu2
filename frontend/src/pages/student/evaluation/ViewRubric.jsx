import * as React from 'react';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Autocomplete from '@mui/joy/Autocomplete';
import { Box } from '@mui/joy';
import { Typography } from "@mui/joy"

export default function ViewRubric(){
    return(
        
        <Box component="header" sx={{ display: 'flex', flexDirection: 'column', mt: 2, mb: 1, gap: 1, alignItems: 'start', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', overflow: 'hidden' }}>
        
    
    <FormControl id="disabled-options-demo" sx={{ width: '100%', maxWidth: 300, margin: 0 }}>
      <FormLabel sx={{ mb: 2, alignSelf: 'flex-start' }}>Compañero a evaluar - grupo 4</FormLabel>
      
    </FormControl>
    <Typography level="h3" component="h3">Aquí va la rubrica </Typography>
    </Box>
        
    )
}