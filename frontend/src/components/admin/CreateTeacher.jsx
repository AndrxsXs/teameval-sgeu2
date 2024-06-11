import * as React from "react";
import api from "../../api";
import { useState } from "react";
import ModalFrame from "../ModalFrame";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import { AspectRatio } from "@mui/joy";
import Add from "@mui/icons-material/Add";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Avatar from "@mui/joy/Avatar";

export default function CreateTeacher() {
  const [loading, setLoading] = useState(false);

  const route = "api/register_teacher/";

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    last_name: "",
    email: "",
    phone: undefined,
  });

  const handleSubmit = async (event) => {
    // console.log(formData);
    setLoading(true);
    event.preventDefault();

    const token = localStorage.getItem("ACCESS_TOKEN");

    try {
      const response = await api.post(route, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        const data = await response.data;
        console.log(data);
        // Emitir el evento 'userCreated' después de crear un nuevo usuario
        window.dispatchEvent(new Event("userCreated"));
        setFormData({
          code: "",
          name: "",
          last_name: "",
          email: "",
          phone: undefined,
        });
        // Emitir el evento 'userCreated' después de crear un nuevo usuario
        window.dispatchEvent(new Event("user-created"));
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: `${data.message}`,
              severity: "success",
            },
          })
        );
      } else {
        const data = await response.data;
        // console.error('Error:', response.status, response.statusText);
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: `${data.message}`,
              severity: "danger",
            },
          })
        );
      }
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent("responseEvent", {
          detail: {
            message: `${error.response.data.message}`,
            severity: "danger",
          },
        })
      );
    }

    setLoading(false);
    handleCloseModal(false);
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
        color="primary"
        // size="sm"
        startDecorator={<Add />}
        onClick={handleOpenModal}
      >
        Nuevo docente
      </Button>

      <ModalFrame
        open={isModalOpen}
        onClose={handleCloseModal}
        ModalTitle="Nuevo docente"
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
              // spacing={3}
              sx={{ display: "flex", my: 1 }}
            >
              {/* profile picture */}

              <Stack
                direction="column"
                spacing={1}
                sx={{
                  display: { sm: "none", md: "none" },
                }}
              >
                <AspectRatio
                  ratio="1"
                  maxHeight={200}
                  sx={{
                    // position: 'relative',
                    flex: 1,
                    minWidth: 120,
                    borderRadius: "100%",
                    // border: '1px solid',
                    borderColor: "divider",
                    // backgroundImage: `url(${<PersonAddRoundedIcon />})`,
                  }}
                >
                  <Avatar
                    variant="outlined"
                    // src={profilePicture}
                    alt=""
                    sx={{
                      width: "",
                      height: "",
                    }}
                  />
                </AspectRatio>
                <IconButton
                  aria-label="Subir una nueva imagen"
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  sx={{
                    bgcolor: "background.body",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    left: 110,
                    top: 150,
                    boxShadow: "sm",
                  }}
                >
                  {/* <Input type="file"> */}
                  <EditRoundedIcon />
                  {/* </Input> */}
                </IconButton>
              </Stack>

              {/* end profile picture */}

              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                <Stack
                  component="section"
                  sx={{ flexDirection: "row", gap: 2, alignItems: "flex-end" }}
                >
                  <FormControl
                  //sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                  >
                    <FormLabel>Nombres</FormLabel>
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
                    <FormLabel>Cédula</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Ingrese el código"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      type="number"
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Teléfono (Opcional)</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Ingrese el teléfono"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      type="tel"
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
