/* eslint-disable react/prop-types */
import { useState } from "react";
import ModalFrame from "../ModalFrame";
import ImportStudents from "../admin/ImportStudents";
import { Button, Typography, Box, Stack, Card, CardContent } from "@mui/joy";
import FileUploadIcon from "@mui/icons-material/FileUpload";
// import UploadIcon from "@mui/icons-material/Upload";

import api from "../../api";
import eventDispatcher from "../../utils/eventDispacher";

export default function ImportUsersModal({ courseId, isStudent, ...styles }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const route = isStudent ? "import_student" : "import_teacher";
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

  const handleSubmitStudent = async () => {
    setLoading(true);

    if (selectedFile) {
      const formData = new FormData();
      formData.append("csv_file", selectedFile);

      await api
        .post(`/api/${route}/`, formData, {
          params: {
            course_code: course_code,
          },
        })
        .then((response) => {
          window.dispatchEvent(new Event("user-created"));
          setIsModalOpen(false);
          setLoading(false);
          eventDispatcher("responseEvent", response);
        })
        .catch((error) => {
          eventDispatcher("responseEvent", error, "danger");
          setLoading(false);
        });
    }
  };

  const handleSubmitTeacher = async () => {
    setLoading(true);
    const token = localStorage.getItem("ACCESS_TOKEN");

    if (selectedFile) {
      const formData = new FormData();
      formData.append("csv_file", selectedFile);

      await api
        .post(`/api/${route}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
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
        })
        .catch((error) => {
          // console.log(error.response.data);
          window.dispatchEvent(
            new CustomEvent("responseEvent", {
              detail: {
                message: error.response.data.error,
                severity: "danger",
              },
            })
          );
          setLoading(false);
        });
    }
  };

  return (
    <>
      <Button
        startDecorator={<FileUploadIcon />}
        onClick={handleOpenModal}
        {...styles}
      >
        Importar {isStudent ? "estudiantes" : "docentes"}
      </Button>
      <ModalFrame
        onClose={handleCloseModal}
        open={isModalOpen}
        ModalTitle={`Importar ${isStudent ? "estudiantes" : "docentes"}`}
      >
        <Box>
          <Typography level="body-sm">
            Suba un archivo CSV con los datos de los{" "}
            {isStudent ? "estudiantes" : "docentes"} que desea importar.
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
              <ImportStudents
                onFileChange={handleFileChange}
                isStudent={isStudent}
                variant="soft"
              />
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
            onClick={isStudent ? handleSubmitStudent : handleSubmitTeacher}
            loading={loading}
          >
            Subir
          </Button>
        </Stack>
      </ModalFrame>
    </>
  );
}
