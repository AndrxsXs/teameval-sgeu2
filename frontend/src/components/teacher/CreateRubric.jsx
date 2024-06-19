/* eslint-disable react/prop-types */
import * as React from "react";
import { useState } from "react";
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add";
import ModalFrame from "../ModalFrame";
import Box from "@mui/joy/Box";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

import eventDispatcher from "../../utils/eventDispacher";

import api from "../../api";
import { useParams } from "react-router-dom";

import IconButton from "@mui/joy/IconButton";
import CloseRounded from "@mui/icons-material/CloseRounded";

import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";

import CriteriaTable from "../CriteriaTable";

import Stack from "@mui/joy/Stack";

const headCells = [
  {
    id: "text",
    numeric: false,
    disablePadding: true,
    label: "Criterio",
  },
  {
    id: "scale",
    numeric: false,
    disablePadding: false,
    label: "Descripción de la escala",
  },
];

export default function CreateRubric(props) {
  const { adminMode, editMode, data } = props;
  const courseId = useParams().courseId;
  const [loading, setLoading] = useState(false);
  // console.log(courseId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const action = React.useRef(null);
  const [addNewRow, setAddNewRow] = useState(false);
  const [rubric, setRubric] = useState(
    editMode && data
      ? data
      : {
          name: "",
          standards: [{ description: "", scale_description: "" }],
          scale: {
            Lower_limit: 1,
            Upper_limit: null,
          },
        }
  );
  React.useEffect(() => {
    const handleAddNewRow = () => {
      const lastRow = rubric.standards[rubric.standards.length - 1];
      if (
        lastRow.description.trim() !== "" ||
        lastRow.scale_description.trim() !== ""
      ) {
        setRubric((prevRubric) => ({
          ...prevRubric,
          standards: [
            ...prevRubric.standards,
            { description: "", scale_description: "" },
          ],
        }));
      } else {
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message:
                "Por favor, complete los campos de la última fila antes de agregar una nueva.",
              severity: "warning",
            },
          })
        );
      }
    };

    if (addNewRow) {
      handleAddNewRow();
      setAddNewRow(false);
    }
  }, [addNewRow, rubric.standards]);

  const handleAddRow = () => {
    setAddNewRow(true);
  };

  const handleRemoveLastRow = () => {
    if (rubric.standards.length > 1) {
      setRubric((prevRubric) => ({
        ...prevRubric,
        standards: prevRubric.standards.slice(0, -1),
      }));
    }
  };

  const handleStandardsChange = (updatedStandards) => {
    setRubric((prevRubric) => ({
      ...prevRubric,
      standards: updatedStandards,
    }));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (value) => {
    setIsModalOpen(value);
  };

  const handleResetFormData = () => {
    setRubric({
      name: "",
      standards: [{ description: "", scale_description: "" }],
      scale: {
        Lower_limit: 1,
        Upper_limit: null,
      },
    });
  };

  const handleCreateRubric = (e) => {
    setLoading(true);
    e.preventDefault();
    // console.log(rubric);
    api
      .post(
        `api/${!adminMode ? "create_rubric" : "create_global_rubric"}`,
        rubric,
        !adminMode ? { params: { course_code: courseId } } : null
      )
      .then((response) => {
        // console.log(response);
        setIsModalOpen(false);
        window.dispatchEvent(new Event("load"));
        eventDispatcher("responseEvent", response);
        setLoading(false);
        handleResetFormData();
      })
      .catch((error) => {
        // console.error(error);
        eventDispatcher("responseEvent", error, "danger");
        setLoading(false);
      });
  };

  const handleEditRubric = (e) => {
    setLoading(true);
    e.preventDefault();
    // console.log(rubric);
    api
      .put(`api/edit_rubric/${data.id}`, rubric)
      .then((response) => {
        // console.log(response);
        setIsModalOpen(false);
        window.dispatchEvent(new Event("load"));
        eventDispatcher("responseEvent", response);
        setLoading(false);
        handleResetFormData();
      })
      .catch((error) => {
        // console.error(error);
        eventDispatcher("responseEvent", error, "danger");
        setLoading(false);
      });
  };

  return (
    <React.Fragment>
      <Button
        color="primary"
        // size="sm"
        startDecorator={<Add />}
        onClick={handleOpenModal}
      >
        {editMode ? "Editar" : "Nueva"} rúbrica {adminMode && "global"}
      </Button>
      <ModalFrame
        open={isModalOpen}
        onClose={handleCloseModal}
        ModalTitle="Crear rúbrica"
      >
        <form onSubmit={!editMode ? handleCreateRubric : handleEditRubric}>
          <Stack
            component="article"
            direction="column"
            gap={2}
            sx={{
              width: "100%",
              height: "100%",
              overflow: "auto",
              padding: 1,
            }}
          >
            <Stack
              direction="column"
              sx={{
                width: "1000px",
                height: "clamp(400px, 70vh, 700px)",
                // overflow: "auto",
                gap: 2,
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Stack
                component="section"
                direction={{ xs: "column", sm: "row" }}
                gap={2}
                sx={{
                  width: "60%",
                  "& > *": {
                    width: "50%",
                  },
                }}
              >
                <FormControl>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    size="sm"
                    placeholder="Nombre de la rúbrica"
                    value={rubric.name}
                    onChange={(e) =>
                      setRubric({ ...rubric, name: e.target.value })
                    }
                    required
                  />

                  <FormHelperText>
                    Este será el nombre de la rúbrica.
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel>Escala</FormLabel>
                  <Select
                    required
                    action={action}
                    placeholder="Desde 1 hasta..."
                    size="sm"
                    value={rubric.scale.Upper_limit}
                    onChange={(e, value) => {
                      setRubric({
                        ...rubric,
                        scale: {
                          ...rubric.scale,
                          Upper_limit: value,
                        },
                      });
                    }}
                    {...(rubric.scale.Upper_limit && {
                      endDecorator: (
                        <IconButton
                          size="xs"
                          variant="plain"
                          color="neutral"
                          onMouseDown={(event) => {
                            // don't open the popup when clicking on this button
                            event.stopPropagation();
                          }}
                          onClick={() =>
                            setRubric({
                              ...rubric,
                              scale: {
                                ...rubric.scale,
                                Upper_limit: null,
                              },
                            })
                          }
                        >
                          <CloseRounded />
                        </IconButton>
                      ),
                      indicator: null,
                    })}
                  >
                    {Array.from(new Array(9)).map((_, index) => (
                      <Option key={index} value={index + 2}>
                        {index + 2}
                      </Option>
                    ))}
                  </Select>
                  <FormHelperText>
                    Seleccione el límite superior de la escala de la rúbrica.
                  </FormHelperText>
                </FormControl>

                {/* <FormControl>
                  <FormLabel>Fecha de inicio</FormLabel>
                  <Input
                    type="date"
                    slotProps={{
                      input: {
                        min: "2024-01-01",
                        max: "2025-12-12",
                      },
                    }}
                    value={evaluation.start_date}
                    onChange={(e) =>
                      setEvaluation({ ...evaluation, start_date: e.target.value })
                    }
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Fecha de finalización</FormLabel>
                  <Input
                    type="date"
                    slotProps={{
                      input: {
                        min: "2024-01-01",
                        max: "2025-12-12",
                      },
                    }}
                    value={evaluation.end_date}
                    onChange={(e) =>
                      setEvaluation({ ...evaluation, end_date: e.target.value })
                    }
                    required
                  />
                </FormControl> */}
              </Stack>

              <CriteriaTable
                rows={rubric.standards}
                headCells={headCells}
                onStandardsChange={handleStandardsChange}
              />
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row-reverse" gap={1}>
                <Button
                  onClick={handleAddRow}
                  disabled={
                    !(
                      rubric.standards[
                        rubric.standards.length - 1
                      ].description.trim() !== "" ||
                      rubric.standards[
                        rubric.standards.length - 1
                      ].scale_description.trim() !== ""
                    )
                  }
                >
                  Añadir criterio
                </Button>
                <Button
                  variant="soft"
                  color="danger"
                  onClick={handleRemoveLastRow}
                  disabled={rubric.standards.length === 1}
                >
                  Eliminar último criterio
                </Button>
              </Stack>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignSelf: "flex-end",
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
                  {editMode ? "Guardar cambios" : "Crear rúbrica"}
                </Button>
              </Box>
            </Stack>
          </Stack>
        </form>
      </ModalFrame>
    </React.Fragment>
  );
}
