import { useState } from "react";
import ModalFrame from "../../ModalFrame";
import Add from '@mui/icons-material/Add';
import { Button, Typography, Box, Stack, Card, CardContent } from "@mui/joy";
import UploadResources from "./UploadResources";
import '../../../styles/pages/teacher/DragUpload.css';

export default function ImportResources() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = (value) => {
    setIsModalOpen(value);
  }

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    setFiles(droppedFiles);
  };

  return (
    <>
      <Button startDecorator={<Add />} onClick={handleOpenModal}>
        Añadir Recursos
      </Button>
      <ModalFrame onClose={handleCloseModal} open={isModalOpen} ModalTitle="Añadir recursos">
        <Box>
          <Typography level="body-md">
            Compartir recursos para el mejoramiento del trabajo en equipo
          </Typography>
          <br />

          <Card
            variant="outlined"
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
            }}
            onDrop={handleDrop}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <UploadResources files={files} />
            </CardContent>
          </Card>

          <br />
        </Box>
        <Stack direction='row' gap={2} justifyContent='flex-end'>
          <Button variant="outlined" color="neutral" onClick={() => setIsModalOpen(false)} sx={{ alignSelf: 'center' }}>
            Cancelar
          </Button>
          <Button sx={{ alignSelf: 'center', color: 'white' }} type="submit">
            Subir
          </Button>
        </Stack>
      </ModalFrame>
    </>
  )
}