/* eslint-disable react/prop-types */
import { useState } from "react";

import api from "../../../api";

import ModalFrame from "../../ModalFrame";
import UngroupedStudentsTable from "./UngroupedStudentsTable";

import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";

import Add from "@mui/icons-material/Add";

export default function CreateGroup({ course }) {
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    assigned_project: "",
    student_codes: [],
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    setLoading(true);

    const token = localStorage.getItem("ACCESS_TOKEN");

    const groupData = {
      ...formData,
      // students: selectedStudents,
      student_codes: selectedStudents, // Asegúrate de que selectedStudents sea un array de códigos de estudiantes
    };
    // console.log(groupData);

    await api
      .post(`api/create_group/${course}/`, groupData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFormData(response.data);
        setLoading(false);
        setOpen(false);
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: "Grupo creado exitosamente",
              severity: "success",
            },
          })
        );
        window.dispatchEvent(new CustomEvent("group-created"));
      })
      .catch((error) => {
        setLoading(false);
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: `${error.response.data.message}`,
              severity: "danger",
            },
          })
        );
      });
  };

  const handleSelectedStudentsChange = (selectedStudents) => {
    setSelectedStudents(selectedStudents);
  };

  return (
    <>
      <Button
        color="primary"
        startDecorator={<Add />}
        // size="sm"
        onClick={handleOpen}
      >
        Nuevo grupo
      </Button>
      <ModalFrame ModalTitle="Nuevo grupo" open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <Box
            component="article"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "flex-start",
              minWidth: "500px",
              maxWidth: "700px",
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
                    <FormLabel>Proyecto</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Nombre del proyecto"
                      value={formData.assigned_project}
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
                </Stack>
                <Stack
                  component="section"
                  direction="column"
                  gap={2}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    width: "100%",
                  }}
                >
                  <UngroupedStudentsTable
                    course={course}
                    onSelectedStudentsChange={handleSelectedStudentsChange}
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
