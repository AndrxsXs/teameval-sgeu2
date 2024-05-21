// import React from 'react';
// import { Box, Button, Typography } from '@mui/joy';
// import UploadIcon from '@mui/icons-material/Upload';

// const ImportStudent = ({ handleClose }) => {
//   return (
//     <>
//       <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
//         Recursos
//       </Typography>
//       <Box sx={{ border: '1px solid gray', padding: 2 }}>

//         <Typography variant="body2" sx={{ marginBottom: 2 }}>
//           Compartir recursos para el mejoramiento del trabajo en equipo
//         </Typography>
//         <Box
//           sx={{
//             border: '1px solid lightgray',
//             padding: '16px',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             borderRadius: '4px',
//             marginBottom: 2,
//           }}
//         >
//           <UploadIcon sx={{ color: 'blue', marginRight: '8px' }} />
//           <Typography variant="body2">
//             Haga clic para actualizar o arrastre y suelte.
//           </Typography>
//         </Box>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//           <Button variant="outlined" color="neutral" sx={{ alignSelf: 'center' }} onClick={handleClose}>
//             Cancelar
//           </Button>
//           <Button sx={{ alignSelf: 'center', color: 'white' }} type="submit" >
//             Enviar
//           </Button>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default ImportStudent;

import {
  useState,
} from "react";

import ModalFrame from "../ModalFrame";
import ImportStudents from "../admin/ImportStudents";

import {
  Button,
  Typography,
  Box,
  Stack,
} from "@mui/joy";

import FileUploadIcon from '@mui/icons-material/FileUpload';
import UploadIcon from '@mui/icons-material/Upload';

export default function ImportStudent() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = (value) => {
    setIsModalOpen(value);
  }

  return (
    <>
      <Button
        startDecorator={<FileUploadIcon />}
        onClick={handleOpenModal}
      >
        Importar estudiantes
      </Button>

      <ModalFrame
        onClose={handleCloseModal}
        open={isModalOpen}
        ModalTitle="Importar estudiantes"
      >
        {/* <Box
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
        </Box> */}

        <Box>
          <Typography
            level="body-md"
          >
            Suba un archivo CSV con los datos de los estudiantes a importar.
          </Typography>
          <Typography
            level="body-md"
          >
            El archivo debe contener las columnas: nombre, apellido, email, y número de documento.
          </Typography>
          <br />
          <ImportStudents />
          <Typography
            level="body-xs"
          >
            Revise el archivo antes de subirlo, ya que 
            <Typography
            color="danger"
            variant="soft"
            >no se podrá deshacer</Typography> la acción.
          </Typography>
          <br />
        </Box>


        <Stack
          direction='row'
          gap={2}
          justifyContent='flex-end'
        >
          <Button variant="outlined" color="neutral" onClick={() => setIsModalOpen(false)} sx={{ alignSelf: 'center' }}>
            Cancelar
          </Button>
          <Button sx={{ alignSelf: 'center', color: 'white' }} type="submit" >
            Subir
          </Button>
        </Stack>
      </ModalFrame>
    </>
  )
}