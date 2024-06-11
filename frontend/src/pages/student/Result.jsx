import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Skeleton from "@mui/joy/Skeleton";
import CourseCard from "./Grades";
import { useEffect, useState } from "react";

import api from "../../api";
import { useOutletContext } from "react-router-dom";

export default function Result() {
  const [loading, setLoading] = useState(false);
  const [evaluations, setEvaluations] = useState([]);
  const userData = useOutletContext();

  useEffect(() => {
    const fetchEvaluations = async () => {
      setLoading(true);
      const token = localStorage.getItem("ACCESS_TOKEN");
      await api
        .get(`api/completed_evaluations/${userData.code}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setEvaluations(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
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
