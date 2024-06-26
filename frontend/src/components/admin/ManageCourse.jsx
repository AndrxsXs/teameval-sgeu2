/* eslint-disable react/prop-types */
import { useState, Fragment, useEffect } from "react";
import api from "../../api";
import ModalFrame from "../ModalFrame";

import ImportStudents from "./ImportStudents";

import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Autocomplete from "@mui/joy/Autocomplete";

import { Add } from "@mui/icons-material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useNavigate } from "react-router";
import eventDispatcher from "../../utils/eventDispacher";

export default function ManageCourse(props) {
  const { course, editMode } = props;
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(undefined);
  const [cycle, setCycle] = useState(undefined);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    academic_period: "",
    user_teacher: "",
  });
  const route = editMode ? `api/update_course` : `api/create_course/`;

  // console.log(course);

  useEffect(() => {
    if (editMode) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        code: course.code,
        name: course.name,
        academic_period: course.academic_period,
        user_teacher: course.teacher.code,
      }));
      const [yearValue, cycleValue] = course.academic_period.split("-");
      setYear(yearValue);
      setCycle(cycleValue);
    }
  }, [editMode, course]);

  // console.log("Curso entrante: ", course);
  // console.log("FormData: ", formData);

  const [teachers, setTeachers] = useState([]);

  const navigate = useNavigate();

  const fetchTeachers = async () => {
    try {
      const response = await api.get("api/teachers_for_course/");
      setTeachers(response.data.filter((teacher) => teacher.status === true));
      // console.log("Docentes:", response.data);
    } catch (error) {
      eventDispatcher("responseEvent", error, "danger");
    }
  };

  useEffect(() => {
    if (year && cycle) {
      const newAcademicPeriod = `${year}-${cycle}`;
      setFormData((prevFormData) => ({
        ...prevFormData,
        academic_period: newAcademicPeriod,
      }));
      // console.log('Periodo académico:', newAcademicPeriod);
    }
  }, [year, cycle]);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  const handleResetFormData = () => {
    setFormData({
      code: "",
      name: "",
      academic_period: "",
      user_teacher: "",
    });
    setTeachers([]);
    setYear(undefined);
    setCycle(undefined);
    if (selectedFile) {
      handleFileChange(null);
    }
  };

  const handleFileUpload = async () => {
    eventDispatcher(
      "responseEvent",
      "Cargando archivo, en breve verá los usuarios importados."
    );
    const file = new FormData();
    file.append("csv_file", selectedFile);
    await api
      .post("/api/import_student/", file, {
        params: {
          course_code: formData.code,
        },
      })
      .then((response) => {
        window.dispatchEvent(new Event("load"));
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: response.data.message,
              severity: "success",
            },
          })
        );
        window.dispatchEvent(new Event("course-created"));
        setLoading(false);
        setIsModalOpen(false);
      })
      .catch((error) => {
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
  };

  const handleSubmit = async (event) => {
    // console.log(formData);
    setLoading(true);
    event.preventDefault();
    await api
      .request({
        method: editMode ? "put" : "post",
        url: route,
        data: formData,
        params: {
          course_code: editMode ? course.code : formData.code,
        },
      })
      .then((response) => {
        if (editMode && course.code != formData.code) {
          navigate(`/admin/manage/courses/${formData.code}`);
        } else {
          editMode && window.dispatchEvent(new Event("course-updated"));
        }
        window.dispatchEvent(new Event("course-created"));
        eventDispatcher("responseEvent", response);
        handleResetFormData();
        if (selectedFile) handleFileUpload();
        setLoading(false);
        !editMode && navigate(`/admin/manage/courses`);
        handleCloseModal(false);
      })
      .catch((error) => {
        eventDispatcher("responseEvent", error, "danger");
        setLoading(false);
      });

    // setLoading(false);
    // handleCloseModal(false);
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
    <Fragment>
      {!editMode ? (
        <Button
          color="primary"
          // size="sm"
          startDecorator={<Add />}
          onClick={handleOpenModal}
        >
          Nuevo curso
        </Button>
      ) : (
        <Button
          startDecorator={<EditRoundedIcon />}
          variant="outlined"
          color="neutral"
          onClick={handleOpenModal}
        >
          Editar
        </Button>
      )}

      <ModalFrame
        open={isModalOpen}
        onClose={handleCloseModal}
        ModalTitle="Nuevo curso"
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
              overflow: "auto",
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
                      placeholder="Nombre del curso"
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
                    <FormLabel>Código</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Código del curso"
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
                    <Autocomplete
                      size="sm"
                      options={teachers}
                      onFocus={fetchTeachers}
                      isOptionEqualToValue={(option, value) =>
                        option.code === value.code
                      }
                      placeholder="Seleccione un docente"
                      getOptionLabel={(option) =>
                        `${option.name} ${option.last_name}`
                      }
                      onChange={(e, value) => {
                        setFormData({ ...formData, user_teacher: value.code });
                      }}
                      defaultValue={editMode && course.teacher}
                      required
                    />
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
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 1,
                        maxWidth: "100%",
                      }}
                    >
                      <Select
                        size="sm"
                        placeholder="Año"
                        value={year || ""}
                        onChange={(e, value) => setYear(value)}
                        required
                      >
                        <Option value="2024">2024</Option>
                        <Option value="2025">2025</Option>
                        <Option value="2026">2026</Option>
                      </Select>
                      <Select
                        size="sm"
                        placeholder="Ciclo"
                        value={cycle || ""}
                        onChange={(e, value) => setCycle(value)}
                        required
                      >
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                      </Select>
                    </Box>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
            <ImportStudents
              isStudent
              onFileChange={handleFileChange}
              file={selectedFile}
            />
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
                Crear
              </Button>
            </Box>
          </Box>
        </form>
      </ModalFrame>
    </Fragment>
  );
}
