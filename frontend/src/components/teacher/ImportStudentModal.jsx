/* eslint-disable react/prop-types */
import { useState } from "react";
import ModalFrame from "../ModalFrame";
import ImportStudents from "../admin/ImportStudents";
import { Button, Typography, Box, Stack, Card, CardContent } from "@mui/joy";
import FileUploadIcon from "@mui/icons-material/FileUpload";
// import UploadIcon from "@mui/icons-material/Upload";

import api from "../../api";

export default function ImportStudentModal({ courseId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const course_code = courseId;
  // console.log(course_code);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (value) => {
    setIsModalOpen(value);
  };

  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem("ACCESS_TOKEN");

    if (selectedFile) {
      const formData = new FormData();
      formData.append("csv_file", selectedFile);

      try {
        const response = await api.post("/api/import_student/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            course_code: course_code,
          },
        });
        if (response.status === 201) {
          setIsModalOpen(false);
          window.dispatchEvent(
            new CustomEvent("responseEvent", {
              detail: {
                message: response.data.message,
                severity: "success",
              },
            })
          );
          setLoading(false);
        }
        // Handle the response here
      } catch (error) {
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: error.response.data.message,
              severity: "danger",
            },
          })
        );
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Button startDecorator={<FileUploadIcon />} onClick={handleOpenModal}>
        Importar estudiantes
      </Button>
      <ModalFrame
        onClose={handleCloseModal}
        open={isModalOpen}
        ModalTitle="Importar estudiantes"
      >
        <Box>
          <Typography level="body-sm">
            Suba un archivo CSV con los datos de los estudiantes a importar.
          </Typography>
          {/* <Typography level="body-md">
            El archivo debe contener las columnas: nombre, apellido, email, y número de documento. ???????
          </Typography> */}
          <br />
          <Card variant="outlined">
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <ImportStudents onFileChange={handleFileChange} />
              {/* <Typography level="body-xs" sx={{ textAlign: 'center' }}>
                <u>Revise los datos</u> antes de enviar el archivo ya que <Typography color="danger" variant="soft">no se podrá deshacer la acción</Typography>.
              </Typography> */}
            </CardContent>
          </Card>
          <br />
        </Box>
        <Stack direction="row" gap={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            color="neutral"
            onClick={() => setIsModalOpen(false)}
            sx={{ alignSelf: "center" }}
          >
            Cancelar
          </Button>
          <Button
            sx={{ alignSelf: "center", color: "white" }}
            type="submit"
            onClick={handleSubmit}
            loading={loading}
          >
            Subir
          </Button>
        </Stack>
      </ModalFrame>
    </>
  );
}
