import * as React from 'react';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Autocomplete from '@mui/joy/Autocomplete';
import { Box } from '@mui/joy';
import { Typography } from "@mui/joy"
import api from '../../../api';
import {
  useState,
  Fragment,
  useEffect,

} from 'react';


// Lista de nombres de compañeros
//const companeros = ['Sebastian  Hidalgo', 'Juan Felipe Plaza', 'David Molta'];




export default function ViewCursoStudent() {
  const [companeros, setCompaneros] = useState([]);

  const fetchCompaneros = async () => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    try {
        const response = await api.get('api/group_members/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                role: 1
            }
        });
        setCompaneros(response.data);
        // console.log('Docentes:', response.data);
    } catch (error) {
        console.error('Error obteniendo datos de grupos:', error);
    }
  };

  return (
    <Box component="header" sx={{ display: 'flex', flexDirection: 'column', mt: 2, mb: 1, gap: 1, alignItems: 'start', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', overflow: 'hidden' }}>
        <Typography level="h2" component="h1">Evaluación</Typography>
    
    <FormControl id="disabled-options-demo" sx={{ width: '100%', maxWidth: 300, margin: 0 }}>
      <FormLabel sx={{ mb: 2, alignSelf: 'flex-start' }}>Seleccione el compañero que desea evaluar.</FormLabel>
      <Autocomplete
        options={companeros}
        onFocus={fetchCompaneros}
        size='sm'
        //va así?
        isOptionEqualToValue={(option, value) => option.code === value.code}
        placeholder="Compañero a evaluar"
        getOptionDisabled={(option) => option === companeros[0]}
        //cuadrar esto:
        //getOptionLabel={(option) => `${option.name} ${option.last_name}`}
        //onChange={(e, value) => { setFormData({ ...formData, user_teacher: value.code }) }}
        sx={{ width: '100%' }}
        required
      />
     
    </FormControl>
    </Box>
  );
}


