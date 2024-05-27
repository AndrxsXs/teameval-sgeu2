import { useState } from "react";
import ModalFrame from "../ModalFrame";
import ImportStudents from "../admin/ImportStudents";
import {
  Button,
  Typography,
  Box,
  Stack,
  Card,
  CardContent,
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
      <Button startDecorator={<FileUploadIcon />} onClick={handleOpenModal}>
        Importar estudiantes
      </Button>
      <ModalFrame onClose={handleCloseModal} open={isModalOpen} ModalTitle="Importar estudiantes">
        <Box>
          <Typography level="body-sm">
            Suba un archivo CSV con los datos de los estudiantes a importar.
          </Typography>
          {/* <Typography level="body-md">
            El archivo debe contener las columnas: nombre, apellido, email, y número de documento. ???????
          </Typography> */}
          <br />
          <Card variant="outlined">
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <ImportStudents />
              <Typography level="body-xs" sx={{ textAlign: 'center' }}>
                <u>Revise los datos</u> antes de enviar el archivo ya que <Typography color="danger" variant="soft">no se podrá deshacer la acción</Typography>.
              </Typography>
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