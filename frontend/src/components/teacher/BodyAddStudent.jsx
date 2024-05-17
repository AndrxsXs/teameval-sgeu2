import * as React from 'react';
import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import RadioGroup from '@mui/joy/RadioGroup';
import Radio from '@mui/joy/Radio';
import Sheet from '@mui/joy/Sheet';
import { Box, Typography } from "@mui/joy"
import OrderTable from './OrderTable';
import AdminTable from '../../components/admin/AdminTable';
import Stack from '@mui/joy/Stack';

export default function BodyAddStudent() {
    return (
        <Stack spacing={2} 
        variant="outlined"
        sx={{
          borderRadius: 'sm',
          p: 1,
          border: '1px solid #ccc', // Borde gris
          //backgroundColor: '#f9f9f9', // Fondo gris muy claro
          width: '100%',
          //height: '500%',
        height: '80vh', // Altura igual a la altura de la ventana del navegador
        maxHeight: '100vh', // Altura máxima igual a la altura de la ventana del navegador
        overflow: 'auto', // Habilita el desplazamiento solo cuando sea necesario
        display: 'flex', // Permite que el contenido se ajuste automáticamente
        flexDirection: 'column', // Alinea los elementos en una columna
        }}
      >
        <Typography level="h4" component="h1">
          Estudiantes matriculados
        </Typography>

        <Typography level="h8" component="h1">
          Información estudiantes
        </Typography>
       

        <AdminTable/>
        </Stack>
    );
  }