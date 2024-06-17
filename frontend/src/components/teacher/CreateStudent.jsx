/* eslint-disable react/prop-types */
import * as React from "react";
import api from "../../api";
import { useState } from "react";
import ModalFrame from "../ModalFrame";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
// import IconButton from '@mui/joy/IconButton';
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
// import { AspectRatio } from '@mui/joy';
import Add from "@mui/icons-material/Add";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

import { handleKeyPress } from "../../utils/handleKeyPress";
import eventDispatcher from "../../utils/eventDispacher";

export default function CreateStudent(props) {
  const { course } = props;
  const [loading, setLoading] = useState(false);

  const route = `api/courses/${course}/register_student/`;

  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    code: "",
    email: "",
  });

  const handleResetFormData = () => {
    setFormData({
      name: "",
      last_name: "",
      code: "",
      email: "",
    });
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    await api
      .post(route, formData)
      .then((response) => {
        eventDispatcher("responseEvent", response);
        setLoading(false);
        handleCloseModal(false);
        handleResetFormData();
        window.dispatchEvent(new Event("load"));
      })
      .catch((error) => {
        eventDispatcher("responseEvent", error, "danger");
        setLoading(false);
      });
  };

  // const handleSubmit = async (event) => {
  //   setLoading(true);
  //   event.preventDefault();

  //   const token = localStorage.getItem("ACCESS_TOKEN");

  //   try {
  //     const response = await api.post(route, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`, // Aquí es donde se agrega el token a los headers
  //       },
  //     });
  //     // console.log(response);
  //     switch (response.status) {
  //       case 201:
  //         window.dispatchEvent(new Event("load"));
  //         window.dispatchEvent(
  //           new CustomEvent("responseEvent", {
  //             detail: {
  //               message: response.data.message,
  //               severity: "success",
  //             },
  //           })
  //         );
  //         setLoading(false);
  //         handleCloseModal(false);
  //         break;
  //       case 400:
  //         window.dispatchEvent(
  //           new CustomEvent("responseEvent", {
  //             detail: {
  //               message: response.data.message,
  //               severity: "danger",
  //             },
  //           })
  //         );
  //         setLoading(false);
  //         handleCloseModal(false);
  //         break;
  //       default:
  //         window.dispatchEvent(
  //           new CustomEvent("responseEvent", {
  //             detail: {
  //               message: "Error desconocido, inténtenlo de nuevo.",
  //               severity: "danger",
  //             },
  //           })
  //         );
  //         setLoading(false);
  //         handleCloseModal(false);
  //         break;
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     window.dispatchEvent(
  //       new CustomEvent("responseEvent", {
  //         detail: {
  //           message: `${error.response.status} ${error.response.statusText}`,
  //           severity: "danger",
  //         },
  //       })
  //     );
  //     setLoading(false);
  //   }
  // };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (value) => {
    setIsModalOpen(value);
  };

  // const [profilePicture, setProfilePicture] = React.useState(false);

  return (
    <React.Fragment>
      <Button
        color="neutral"
        variant="outlined"
        // size="sm"
        startDecorator={<Add />}
        onClick={handleOpenModal}
      >
        Nuevo estudiante
      </Button>

      <ModalFrame
        open={isModalOpen}
        onClose={handleCloseModal}
        ModalTitle="Añadir otro estudiante al curso"
      >
        <form onSubmit={handleSubmit}>
          <Box
            component="article"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "flex-end",
            }}
          >
            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
            >
              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                <Stack
                  component="section"
                  sx={{ flexDirection: "row", gap: 2, alignItems: "flex-end" }}
                >
                  <FormControl sx={{ width: "300px" }}>
                    <FormLabel>Nombre</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Nombres"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </FormControl>
                  <FormControl sx={{ width: "300px" }}>
                    <FormLabel>Apellidos</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Apellidos"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      type="text"
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack
                  component="section"
                  sx={{ flexDirection: "row", gap: 2, alignItems: "flex-end" }}
                >
                  <FormControl sx={{ width: "300px" }}>
                    <FormLabel>Correo electrónico</FormLabel>
                    <Input
                      size="sm"
                      type="email"
                      startDecorator={<EmailRoundedIcon />}
                      placeholder="su.correo@institución.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </FormControl>
                  <FormControl sx={{ width: "300px" }}>
                    <FormLabel>Código</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Ingrese el código"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      type="text"
                      onKeyDown={handleKeyPress}
                      required
                    />
                  </FormControl>
                </Stack>
              </Stack>
            </Stack>
            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outlined"
                color="neutral"
              >
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                Crear
              </Button>
            </Box>
          </Box>
        </form>
      </ModalFrame>
    </React.Fragment>
  );
}
