/* eslint-disable react/prop-types */
import * as React from "react";
// import api from '../../api';
import { useState } from "react";
import ModalFrame from "../ModalFrame";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";

import eventDispatcher from "../../utils/eventDispacher";

import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

import { handleKeyPress } from "../../utils/handleKeyPress";

import api from "../../api";

export default function EditStudent(props) {
  const { user } = props;
  const [loading, setLoading] = useState(false);

  // const route = "api/edit_user/"

  const [formData, setFormData] = useState({
    code: user.code,
    name: user.name,
    last_name: user.last_name,
    email: user.email,
  });

  const handleEditStudent = async (event) => {
    setLoading(true);
    event.preventDefault();
    const token = localStorage.getItem("ACCESS_TOKEN");
    await api
      .put(`api/update_student`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          student_code: user.code,
        },
      })
      .then((response) => {
        window.dispatchEvent(
          // console.log("Evento de respuesta: ", response),
          new CustomEvent("responseEvent", {
            detail: {
              message: `${response.data.message}`,
              severity: "success",
            },
          })
        );
        window.dispatchEvent(new Event("user-updated"));
        setLoading(false);
        handleCloseModal(false);
        window.dispatchEvent(new Event("user-updated"));
      })
      .catch((error) => {
        eventDispatcher("responseEvent", error, "danger");
        setLoading(false);
      });
  };

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
        // disabled
        size="sm"
        variant="plain"
        color="neutral"
        onClick={handleOpenModal}
      >
        Editar
      </Button>

      <ModalFrame
        open={isModalOpen}
        onClose={handleCloseModal}
        ModalTitle="Editar usuario"
      >
        <form onSubmit={handleEditStudent}>
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
              // spacing={3}
              sx={{ display: "flex", my: 1 }}
            >
              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                <Stack
                  component="section"
                  sx={{ flexDirection: "row", gap: 2, alignItems: "flex-end" }}
                >
                  <FormControl
                  //sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                  >
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
                  <FormControl>
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
                <FormControl>
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
                    //defaultValue="siriwatk@test.com"
                    //sx={{ flexGrow: 1 }}
                  />
                </FormControl>
                <Stack
                  component="section"
                  sx={{ flexDirection: "row", gap: 2 }}
                >
                  <FormControl>
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
                Guardar
              </Button>
            </Box>
          </Box>
        </form>
      </ModalFrame>
    </React.Fragment>
  );
}
