import * as React from 'react';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Autocomplete from '@mui/joy/Autocomplete';
import { Box } from '@mui/joy';
import { Typography } from "@mui/joy"

// Lista de nombres de compañeros
const companeros = ['Sebastian  Hidalgo', 'Juan Felipe Plaza', 'David Molta'];

export default function ViewCursoStudent() {
  return (
    <Box component="header" sx={{ display: 'flex', flexDirection: 'column', mt: 2, mb: 1, gap: 1, alignItems: 'start', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', overflow: 'hidden' }}>
        <Typography level="h2" component="h1">Evaluación</Typography>
    
    <FormControl id="disabled-options-demo" sx={{ width: '100%', maxWidth: 300, margin: 0 }}>
      <FormLabel sx={{ mb: 2, alignSelf: 'flex-start' }}>Seleccione el compañero que desea evaluar.</FormLabel>
      <Autocomplete
        options={companeros}
        placeholder="Compañero a evaluar"
        getOptionDisabled={(option) => option === companeros[0] || option === companeros[0]}
        sx={{ width: '100%' }}
      />
    </FormControl>
    </Box>
  );
}


