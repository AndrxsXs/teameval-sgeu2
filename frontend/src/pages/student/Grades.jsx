/* eslint-disable react/prop-types */
import { useState } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import { Link, useOutletContext } from "react-router-dom";
import { useEffect } from "react";

import Stack from "@mui/joy/Stack";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Skeleton from "@mui/joy/Skeleton";
import Chip from "@mui/joy/Chip";

import api from "../../api";

import eventDispatcher from "../../utils/eventDispacher";
import interpretEvaluationState from "../../utils/interpretEvaluationState";

export function CourseCard({ info, isReviewing }) {
  // console.log(info);

  const route = isReviewing ? "./evaluar" : "./resultados";
  return (
    <Link
      to={`${route}/${info.course.code}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Card
        sx={{
          // width: 300,
          // height: 150,
          width: "100%",
          height: "100%",
          borderRadius: "sm",
          boxShadow: "md",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 2,
          transition: "box-shadow 0.3s",
          "&:hover": {
            boxShadow: "sm",
          },
          overflow: "hidden",
        }}
      >
        <CardContent
          sx={{
            alignItems: "flex-start",
          }}
        >
          <Stack
            width="100%"
            direction="row"
            justifyContent="space-between"
            gap={1}
            alignItems="baseline"
          >
            <Typography level="title-md">
              {info.course.name} - {info.course.code}
            </Typography>
            <Chip
              size="sm"
              color={
                info.estado === 2
                  ? "success"
                  : info.estado === 1
                  ? "warning"
                  : info.estado === 3
                  ? "danger"
                  : "primary"
              }
            >
              {interpretEvaluationState(info.estado)}
            </Chip>
          </Stack>
          <Typography level="body-xs">{info.name}</Typography>
          <Typography level="body-xs">
            {info.course.user_teacher.name} {info.course.user_teacher.last_name}
          </Typography>
          <Typography level="body-xs">{info.course.academic_period}</Typography>
          {/* <Typography level="body-xs">
            Disponible hasta {info.date_end}
          </Typography> */}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Grades() {
  const [loading, setLoading] = useState(true);
  const userData = useOutletContext();
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await api
        .get(`api/available_evaluations`, {
          params: { student_code: userData.code },
        })
        .then((response) => {
          setEvaluations(response.data);
          // console.log(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          eventDispatcher("responseEvent", error, "danger");
        });
    };
    fetchData();
  }, [userData.code]);

  console.log(evaluations)

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
          flexWrap: "nowrap",
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
            Evaluaciones disponibles
          </Typography>
          <Typography level="body-sm">
            Seleccione una evaluación para comenzar a calificar a sus compañeros
            de equipo.
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
          // gridTemplateRows: "repeat(3, 1fr)",
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
              return <CourseCard key={id} info={evaluation} isReviewing />;
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
              No hay evaluaciones disponibles.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
