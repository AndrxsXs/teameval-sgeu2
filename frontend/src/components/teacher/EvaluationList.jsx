import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import CourseCard from "../teacher/RubricList";
import Skeleton from "@mui/joy/Skeleton";

import api from "../../api";
import eventDispatcher from "../../utils/eventDispacher";

export default function EvaluationList() {
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState([]);
  const course_code = useParams().courseId;

  useEffect(() => {
    api
      .get("api/main_report", {
        params: {
          course_code: course_code,
        },
      })
      .then((response) => {
        setEvaluations(response.data);
        setLoading(false);
      })
      .catch((error) => {
        eventDispatcher("responseEvent", error, "danger");
        setLoading(false);
      });
  }, [course_code]);

  return (
    <>
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
        {loading
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
        {evaluations.length === 0 && loading && (
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
            <Typography level="body-sm">
              No hay evaluaciones disponibles. Cree una con el botón{" "}
              <Typography color="primary">Nueva evaluación</Typography>.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
