import { useEffect, useState } from "react";

import api from "../../api";
import eventDispacher from "../../utils/eventDispacher";

import ModalFrame from "../ModalFrame";

import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Chip from "@mui/joy/Chip";

import Add from "@mui/icons-material/Add";

import RubricList from "./RubricList";
import { useParams } from "react-router";

export default function CreateEvaluation() {
  const [selectedRubric, setSelectedRubric] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const course_code = useParams().courseId;

  console.log(selectedRubric || "rubrica no seleccionada");

  const [formData, setFormData] = useState({
    name: "",
    course_code: course_code,
    estado: 1,
    rubric_name: selectedRubric ? selectedRubric.name : "",
  });

  // console.log(selectedRubric);

  const handleResetFormData = () => {
    setFormData({
      name: "",
      code: "",
      estado: 1,
    });
  };

  console.log(formData);

  const handleRubricSelect = (rubric) => {
    setSelectedRubric(rubric);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (selectedRubric) {
      api
        .post("api/create_evaluation", formData, {
          params: {
            course_code: course_code,
          },
        })
        .then((response) => {
          eventDispacher("responseEvent", response);
          handleClose();
          handleResetFormData();
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      eventDispacher("responseEvent", "Debe seleccionar una rúbrica", "danger");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRubric) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        rubric_name: selectedRubric.name,
      }));
    }
  }, [selectedRubric]);

  return (
    <>
      <Button
        color="primary"
        startDecorator={<Add />}
        // size="sm"
        onClick={handleOpen}
      >
        Nueva evaluación
      </Button>
      <ModalFrame
        ModalTitle="Nueva evaluación"
        open={open}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit}>
          <Box
            component="article"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "flex-start",
              minWidth: "500px",
              //   maxWidth: "700px",
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
                      placeholder="Nombre de la evaluación"
                      type="text"
                      defaultValue=""
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
                    <FormLabel>Proyecto</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Nombre del proyecto"
                      defaultValue=""
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          assigned_project: e.target.value,
                        })
                      }
                      type="text"
                      required
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      size="sm"
                      onChange={(e, value) =>
                        setFormData({ ...formData, estado: value })
                      }
                      placeholder="Estado"
                      required
                      defaultValue={1}
                    >
                      <Option value={1}>
                        <Chip color="warning" size="sm">
                          Por iniciar
                        </Chip>
                      </Option>
                      <Option value={2}>
                        <Chip color="success" size="sm">
                          En proceso
                        </Chip>
                      </Option>
                    </Select>
                  </FormControl>

                  {/* <FormControl>
                    <FormLabel>Fecha de inicio</FormLabel>
                    <Input
                      type="date"
                      slotProps={{
                        input: {
                          min: "2024-06-12",
                          max: "2025-12-12",
                        },
                      }}
                      //value
                      //Onchange
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Fecha de finalización</FormLabel>
                    <Input
                      type="date"
                      slotProps={{
                        input: {
                          min: "2024-06-12",
                          max: "2024-12-12",
                        },
                      }}
                      //value
                      //Onchange
                      required
                    />
                  </FormControl> */}
                </Stack>
                <Stack
                  component="section"
                  direction="column"
                  gap={2}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    width: "100%",
                    overflow: "auto"
                  }}
                >
                  <RubricList
                    selectMode={true} // Habilitar el modo de selección
                    onSelect={handleRubricSelect} // Pasar la función de devolución de llamada
                  />
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
                onClick={() => (setOpen(false), handleResetFormData())}
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
