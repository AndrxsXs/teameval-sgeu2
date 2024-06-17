import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import EvaluationCard from "./EvaluationCard";
import Skeleton from "@mui/joy/Skeleton";

import ViewEvaluationModal from "./ViewEvaluationModal";

import api from "../../api";
import eventDispatcher from "../../utils/eventDispacher";

export default function EvaluationList() {
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState([]);
  const course_code = useParams().courseId;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  const handleOpenRubricDetails = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchEvaluations = async () => {
      await api
        .get("api/main_report", {
          params: {
            course_code: course_code,
          },
        })
        .then((response) => {
          console.log("Evaluaciones: ", response.data);
          setEvaluations(response.data);
          setLoading(false);
        })
        .catch((error) => {
          eventDispatcher("responseEvent", error, "danger");
          setLoading(false);
        });
    };
    fetchEvaluations();

    window.addEventListener("load", fetchEvaluations);

    return () => {
      window.removeEventListener("load", fetchEvaluations);
    };
  }, [course_code]);

  return (
    <>
      <Box
        component="section"
        className="contenedor-evaluaciones"
        width="100%"
        height="100%"
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 2,
          overflow: "auto",
          // justifyContent: "flex-start",
          justifyContent: "center",
          alignContent: "start",
          padding: 1,
        }}
      >
        {!loading
          ? evaluations.map((evaluation) => {
              const id = crypto.randomUUID();
              return (
                <EvaluationCard
                  onClick={() => handleOpenRubricDetails(evaluation)}
                  key={id}
                  data={evaluation}
                />
              );
            })
          : Array.from(new Array(6)).map((_, index) => (
              <Skeleton
                key={index}
                animation="wave"
                variant="rectangular"
                width={300}
                height={150}
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
            <Typography level="body-sm">
              No hay evaluaciones disponibles. Cree una con el botón{" "}
              <Typography color="primary">Nueva evaluación</Typography>.
            </Typography>
          </Box>
        )}
      </Box>
      {
        <ViewEvaluationModal
          data={selectedEvaluation}
          open={isModalOpen}
          setOpen={setIsModalOpen}
        />
      }
    </>
  );
}
