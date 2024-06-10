/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import CardCurso from "../../components/teacher/CardCurso";
import TopNavbar from "../../components/TopNavbar";
import { Box, Stack, Typography } from "@mui/joy";
import "../../styles/pages/teacher/MainTeacherView.css";
// import fondo from '../../assets/Fondo.png'
import fondoCard from "../../assets/FondoCardDefecto.png";
// import fondoCiber from '../../assets/FondoCiber.png'

import SignoutButton from "../../components/teacher/SignoutButton";

import api from "../../api";

import { useState, useEffect } from "react";

export default function MainTeacherView(props) {
  const { userData } = props;

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("ACCESS_TOKEN");
        const response = await api.get("api/courses_teacher/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            user: userData.code,
          },
        });
        const data = response.data;
        setCourses(data);
      } catch (error) {
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: `${error.response.status} ${error.response.statusText}`,
              severity: "danger",
            },
          })
        );
      }
    };

    try {
      fetchCourses();
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent("responseEvent", {
          detail: {
            message: `${error.response.status} ${error.response.statusText}`,
            severity: "danger",
          },
        })
      );
    }
  }, [userData.code]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <TopNavbar />

      <Box
        className="contenedor"
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column", // Cambia a columna para que "Mis cursos" esté arriba
          minWidth: 0,
          height: "100%",
          width: "70%",
          maxWidth: "1200px",
          gap: 2,
          justifyContent: "space-between",
          alignItems: "flex-start", // Alinea a la izquierda
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Typography
            level="h2"
            component="h1"
            sx={{ marginBottom: "30px", marginTop: "20px" }}
          >
            Mis cursos
          </Typography>
          <SignoutButton />
        </Stack>
        <Box
          className="contenedor-curso"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            minWidth: 0,
            height: "100%",
            alignSelf: "center",
            gap: 2,
            justifyContent: "center",
          }}
        >
          {courses.map((course) => (
            <Link to={`./curso/${course.code}`} key={course.code}>
              <CardCurso name={course.name} img={fondoCard} course={course} />
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
