import { useState, useEffect } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import CourseCard from "../teacher/RubricList";
import Skeleton from "@mui/joy/Skeleton";

import api from "../../api";

export default function EvaluationList() {
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    
  }, []);

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
              No hay evaluaciones disponibles. Cree una con el botón de arriba.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
