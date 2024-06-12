/* eslint-disable react/prop-types */
import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";

import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import CircularProgress from "@mui/joy/CircularProgress";

import EditCourse from "./EditCourse";
// import DisableCourse from "./DisableCourse"

import { stableSort } from "../utils/stableSort";
import { getComparator } from "../utils/getComparator";

import EnhancedTableHead from "./EnhacedTableHead";

const headCells = [
  {
    id: "code",
    numeric: false,
    disablePadding: true,
    label: "Código",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Nombre",
  },
  {
    id: "academic_period",
    numeric: false,
    disablePadding: false,
    label: "Periodo",
  },
  {
    id: "teacher",
    numeric: false,
    disablePadding: false,
    label: "Docente Asignado",
  },
  {
    id: "student_count",
    numeric: false,
    disablePadding: false,
    label: "Estudiantes",
  },
];
function RowMenu(props) {
  const { course } = props;

  return (
    <Box
      // size='sm'
      sx={{ display: "flex", gap: 1 }}
    >
      <EditCourse course={course} />
      {/* <OpenDetails route={course.code} /> */}
      {/* <DisableCourse course={course} /> */}
    </Box>
  );
}

export default function CourseTable(props) {
  const { searchTerm } = props;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("code");

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const filteredRows = searchTerm
  ? courses.filter(
      (row) =>
        row.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.academic_period.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : courses;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const fetchCourses = async () => {
    setLoading(true);
    const token = localStorage.getItem("ACCESS_TOKEN");
    await api
      .get("api/course_list/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch((error) => {
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: `${error.response.status} ${error.response.statusText}`,
              severity: "danger",
            },
          })
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourses();

    // Escuchar el evento 'courseCreated'
    const handleCourseCreated = () => {
      fetchCourses(); // Llamar a la función para obtener la lista actualizada de cursos
    };

    window.addEventListener("course-created", handleCourseCreated);

    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener("course-created", handleCourseCreated);
    };
  }, []);

  return (
    <Fragment>
      <Sheet
        className="TableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "flex" },
          flexFlow: "column",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
          boxShadow: "sm",
          "&:hover": {
            boxShadow: "none",
          },
          transition: "box-shadow 0.3s",
        }}
      >
        <Table
          aria-labelledby="Tabla de cursos"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableHeader-paddingY": "12px",
            "--TableCell-paddingX": "16px",
            "& thead th": {
              paddingY: "12px",
            },
            "& thead th:nth-of-type(1)": { width: "10%" },
            "& thead th:nth-of-type(2)": { width: "25%" },
            "& thead th:nth-of-type(3)": { width: "10%" },
            "& thead th:nth-of-type(4)": { width: "25%" },
          }}
        >
          <EnhancedTableHead
            headCells={headCells}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            showActions
          />
          <tbody>
            {stableSort(filteredRows, getComparator(order, orderBy)).map(
              (row, index) => (
                <tr
                  key={index}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`./${row.code}`)}
                >
                  <td>
                    <Typography level="body-xs">{row.code}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row.name}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">
                      {row.academic_period}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row.teacher}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row.student_count}</Typography>
                  </td>
                  <td>
                    <RowMenu course={row} />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              minHeight: "41px",
              borderTop:
                courses && courses.length < 1 ? "transparent" : "1px solid",
              borderTopColor: "divider",
            }}
          >
            <CircularProgress size="md" />
            <Typography level="body-xs" sx={{ userSelect: "none" }}>
              <Fragment>Cargando datos...</Fragment>
            </Typography>
          </Box>
        ) : (
          <Typography
            component="span"
            level="body-xs"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              minHeight: "41px",
              borderTop:
                courses && courses.length < 1 ? "transparent" : "1px solid",
              borderTopColor: "divider",
              userSelect: "none",
            }}
          >
            {courses && courses.length === 0 ? (
              <Fragment>No hay cursos</Fragment>
            ) : (
              <Fragment>Nada más por aquí</Fragment>
            )}
          </Typography>
        )}
      </Sheet>
    </Fragment>
  );
}
