import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Skeleton from "@mui/joy/Skeleton";
import CourseCard from "./Grades";
import { useEffect, useMemo, useState } from "react";

import api from "../../api";
import { useOutletContext } from "react-router-dom";

import eventDispatcher from "../../utils/eventDispacher";

export default function Result() {
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState([]);
  const userData = useOutletContext();
  const [courses, setCourses] = useState();
  console.log(userData);

  useMemo(() => {
    const fetchUserCourses = async () => {
      await api
        .get(`api/student_courses/`, {
          params: {
            student_code: userData.code,
          },
        })
        .then((response) => {
          console.log(response.data);
          setCourses(response.data);
        })
        .catch((error) => {
          eventDispatcher("responseEvent", error, "danger");
        });
    };
    fetchUserCourses();
  }, [userData]);

  useEffect(() => {
    const fetchEvaluations = async () => {
      await api
        .get(`api/completed_evaluations`, {
          params: {
            student_code: userData.code,
            course_code: courses.code,
          },
        })
        .then((response) => {
          setEvaluations(response.data);
          setLoading(false);
        })
        .catch((error) => {
          eventDispatcher("responseEvent", error, "danger");
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchEvaluations();
  }, [userData]);

  return (
    <>
      <Box
        component="header"
        sx={{
          display: "flex",
          mt: 2,
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Stack
          direction="column"
          sx={{
            maxWidth: "60%",
          }}
        >
          <Typography level="h2" component="h1">
            Resultados de las evaluaciones
          </Typography>
          <Typography level="body-sm">
            Aquí puede visualizar cómo sus compañeros de equipo le han evaluado.
          </Typography>
        </Stack>
      </Box>
      <Box
        component="section"
        className="contenedor-curso"
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridAutoRows: "150px",
          width: "100%",
          height: "100%",
          gap: 2,
          overflow: "hidden",
        }}
      >
        {!loading
          ? evaluations.map((evaluation) => {
              const id = crypto.randomUUID();
              return <CourseCard key={id} info={evaluation} />;
            })
          : Array.from(new Array(9)).map((_, index) => (
              <Skeleton
                key={index}
                animation="wave"
                variant="rectangular"
                // width={300}
                // height={150}
                loading
                sx={{ borderRadius: "sm" }}
              />
            ))}
        {evaluations.length === 0 && !loading && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "start",
              width: "100%",
            }}
          >
            <Typography level="body-sm" component="p">
              No hay resultados disponibles.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
