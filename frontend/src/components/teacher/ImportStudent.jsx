import React from 'react';
import { Box, Button, Typography } from '@mui/joy';
import UploadIcon from '@mui/icons-material/Upload';

const ImportStudent = ({ handleClose }) => {
  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Recursos
      </Typography>
      <Box sx={{ border: '1px solid gray', padding: 2 }}>

        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Compartir recursos para el mejoramiento del trabajo en equipo
        </Typography>
        <Box
          sx={{
            border: '1px solid lightgray',
            padding: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px',
            marginBottom: 2,
          }}
        >
          <UploadIcon sx={{ color: 'blue', marginRight: '8px' }} />
          <Typography variant="body2">
            Haga clic para actualizar o arrastre y suelte.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" color="neutral" sx={{ alignSelf: 'center' }} onClick={handleClose}>
            Cancelar
          </Button>
          <Button sx={{ alignSelf: 'center', color: 'white' }} type="submit" >
            Enviar
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ImportStudent;