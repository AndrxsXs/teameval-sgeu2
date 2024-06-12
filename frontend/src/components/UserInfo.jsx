/* eslint-disable react/prop-types */
import { Fragment, useState } from "react";

import ModalFrame from "./ModalFrame";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import { Typography } from "@mui/joy";

import api from "../api";
import { ACCESS_TOKEN } from "../constants";

export default function UserInfo({
  user,
  isModalOpen,
  setIsModalOpen,
  admin,
  isStudent,
  setSelectedUser,
}) {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    code: user.code,
    ...(!isStudent ? { phone: user.phone } : {}),
  });

  const target = isStudent ? "student" : "user";

  const handleEditUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem(ACCESS_TOKEN);
    await api
      .put(`api/update_${target}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          [isStudent ? "student_code" : "user_code"]: user.code,
        },
      })
      .then((response) => {
        setIsModalOpen(false);
        setLoading(false);
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: `${response.data.message}`,
              severity: "success",
            },
          })
        );
        window.dispatchEvent(new Event("user-updated"));
        setEdit(false);
      })
      .catch((error) => {
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: `${error.response.data.error}`,
              severity: "danger",
            },
          })
        );
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <ModalFrame
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false), setEdit(false), setSelectedUser(null);
        }}
        ModalTitle={`Información de ${user.name}`}
      >
        <form onSubmit={handleEditUser}>
          <Box
            component="article"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "flex-end",
              width: "440px",
              height: "274px",
            }}
          >
            <Stack
              direction="row"
              // spacing={3}
              sx={{ display: "flex", my: 1, width: "100%", height: "100%" }}
            >
              <Stack
                spacing={2}
                sx={{ flexGrow: 1, width: "100%", height: "100%" }}
              >
                <Stack
                  component="section"
                  sx={{ flexDirection: "row", gap: 2, alignItems: "baseline" }}
                >
                  <FormControl
                    sx={{
                      width: "50%",
                    }}
                  >
                    <FormLabel>Nombre</FormLabel>
                    {!edit ? (
                      <Typography
                        sx={{
                          paddingY: 0.8,
                          paddingX: 1,
                          height: "100%",
                        }}
                        level="body-sm"
                      >
                        {user.name}
                      </Typography>
                    ) : (
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
                    )}
                  </FormControl>
                  <FormControl
                    sx={{
                      width: "50%",
                    }}
                  >
                    <FormLabel>Apellidos</FormLabel>
                    {!edit ? (
                      <Typography
                        sx={{
                          paddingY: 0.8,
                          paddingX: 1,
                          height: "100%",
                        }}
                        level="body-sm"
                      >
                        {user.last_name}
                      </Typography>
                    ) : (
                      <Input
                        size="sm"
                        placeholder="Apellidos"
                        value={formData.last_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            last_name: e.target.value,
                          })
                        }
                        type="text"
                        required
                      />
                    )}
                  </FormControl>
                </Stack>
                <FormControl
                  sx={{
                    width: "100%",
                  }}
                >
                  <FormLabel>Correo electrónico</FormLabel>
                  {!edit ? (
                    <Typography
                      sx={{
                        paddingY: 0.8,
                        paddingX: 1,
                        height: "100%",
                      }}
                      level="body-sm"
                    >
                      {user.email}
                    </Typography>
                  ) : (
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
                  )}
                </FormControl>
                <Stack
                  component="section"
                  sx={{ flexDirection: "row", gap: 2 }}
                >
                  <FormControl
                    sx={{
                      width: "50%",
                    }}
                  >
                    <FormLabel>Código</FormLabel>
                    {!edit ? (
                      <Typography
                        sx={{
                          paddingY: 0.8,
                          paddingX: 1,
                          height: "100%",
                        }}
                        level="body-sm"
                      >
                        {user.code}
                      </Typography>
                    ) : (
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
                    )}
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
              {!edit && admin ? (
                <Fragment>
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="outlined"
                    color="neutral"
                  >
                    Cerrar
                  </Button>
                  <Button
                    type="button" // Agregue este tipo para evitar el envío del formulario
                    onClick={(e) => {
                      e.preventDefault(); // Evite el envío del formulario
                      setEdit(true); // Cambie el estado a modo de edición
                    }}
                  >
                    Editar
                  </Button>
                </Fragment>
              ) : admin ? (
                <Fragment>
                  <Button
                    onClick={() => {
                      setEdit(false), setSelectedUser(null);
                    }}
                    variant="outlined"
                    color="neutral"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" loading={loading}>
                    Guardar
                  </Button>
                </Fragment>
              ) : (
                <Button
                  onClick={() => setIsModalOpen(false)}
                  // variant="outlined"
                  // color="neutral"
                >
                  Cerrar
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </ModalFrame>
    </Fragment>
  );
}
