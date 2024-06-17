/* eslint-disable react/prop-types */
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Skeleton from "@mui/joy/Skeleton";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Chip from "@mui/joy/Chip";

import interpretEvaluationState from "../../utils/interpretEvaluationState";

import api from "../../api";
import { useOutletContext } from "react-router-dom";

import eventDispatcher from "../../utils/eventDispacher";

function CourseCard({ info }) {
  return (
    <Link
      to={`./${info.code}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
      // onClick={() => {
      //   setEvaluationData(info);
      // }}
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
          transition: "box-shadow 0.3s, transform 0.1s",
          "&:hover": {
            boxShadow: "sm",
            transform: "scale(0.99)",
          },
          "&:active": {
            boxShadow: "none",
            transform: "scale(0.98)",
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
              {info.name} - {info.code}
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
            {info.user_teacher.name} {info.user_teacher.last_name}
          </Typography>
          <Typography level="body-xs">{info.academic_period}</Typography>
          {/* <Typography level="body-xs">
            Disponible hasta {info.date_end}
          </Typography> */}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Result() {
  const [loading, setLoading] = useState(true);
  const userData = useOutletContext();
  const userCode = userData.code;
  const [courses, setCourses] = useState([]);
  // console.log(courses);

  useMemo(() => {
    const fetchUserCourses = async () => {
      await api
        .get(`api/courses_evaluations_completed`, {
          params: {
            student_code: userCode,
          },
        })
        .then((response) => {
          setCourses(response.data.data);
          console.log(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          eventDispatcher("responseEvent", error, "danger");
          setLoading(false);
        });
    };
    fetchUserCourses();
  }, [userCode]);

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
          ? courses.map((courses) => {
              const id = crypto.randomUUID();
              return <CourseCard key={id} info={courses} />;
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
        {courses.length === 0 && !loading && (
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
