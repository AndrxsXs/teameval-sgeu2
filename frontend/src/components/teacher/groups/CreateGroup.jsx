import { useState } from "react";

import ModalFrame from "../../ModalFrame";

import { Button, Box, Stack, FormControl, FormLabel, Input } from "@mui/joy";

import Add from "@mui/icons-material/Add";

export default function CreateGroup() {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    user_teacher: "",
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // setLoading(true);
    // axios.post('/api/groups', formData)
    //     .then(response => {
    //         console.log(response.data);
    //         setLoading(false);
    //         setOpen(false);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //         setLoading(false);
    //     });
  };

  return (
    <>
      <Button
        color="primary"
        startDecorator={<Add />}
        size="sm"
        onClick={handleOpen}
      >
        Nuevo grupo
      </Button>
      <ModalFrame ModalTitle="Crear grupo" open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <Box
            component="article"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "flex-start",
              minWidth: "500px",
            }}
          >
            <Stack
              direction="row"
              // spacing={3}
              sx={{ display: "flex", my: 1, width: "100%" }}
            >
              <Stack
                component="section"
                spacing={2}
                sx={{ flexGrow: 1, width: "100%" }}
              >
                <Stack
                  component="section"
                  direction="row"
                  gap={2}
                  alignItems="flex-end"
                  justifyContent="center"
                  sx={{
                    width: "100%",
                  }}
                >
                  <FormControl
                    //sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                    sx={{
                      width: "48%",
                    }}
                  >
                    <FormLabel>Nombre</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Nombre del grupo"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </FormControl>
                  <FormControl
                    sx={{
                      width: "50%",
                    }}
                  >
                    <FormLabel>Nombre clave</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Nombre clave del equipo"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      type="text"
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack
                  component="section"
                  direction="row"
                  gap={2}
                  alignItems="flex-end"
                  justifyContent="space-between"
                  sx={{
                    width: "100%",
                  }}

                  // sx={{
                  //     display: 'grid',
                  //     gridTemplateColumns: '1fr 1fr',
                  //     // flexDirection: 'row',
                  //     gap: 2,
                  //     maxWidth: '100%', justifyContent: 'center'
                  // }}
                >
                  <FormControl
                    sx={{ width: "48%", justifyContent: "space-between" }}
                  >
                    <FormLabel>Docente asignado</FormLabel>
                    {/* <Input size="sm" placeholder="Ingrese el código"
                                            value={formData.code}
                                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                                            type='number' required /> */}
                    {/* <Select
                                            size="sm"
                                            placeholder="Seleccione un docente"
                                        >
                                            <Option value="1">Docente 1</Option>
                                        </Select> */}

              
                  </FormControl>
                  <Box
                    sx={{
                      width: "49%",
                    }}
                  >
                    <FormLabel
                      sx={{
                        marginBottom: "6px",
                      }}
                    >
                      Periodo académico
                    </FormLabel>
                    {/* <Input size="sm" placeholder="Ingrese el teléfono"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            type="tel" /> */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 1,
                        maxWidth: "100%",
                      }}
                    >
                      
                    </Box>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignSelf: "flex-end",
              }}
            >
              <Button
                onClick={() => setOpen(false)}
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
    </>
  );
}
