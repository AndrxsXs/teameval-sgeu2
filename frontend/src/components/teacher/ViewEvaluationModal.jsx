/* eslint-disable react/prop-types */
import { Fragment, useMemo, useState } from "react";

import api from "../../api";
import eventDispatcher from "../../utils/eventDispacher";

import ModalFrame from "../ModalFrame";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";

import interpretEvaluationState from "../../utils/interpretEvaluationState";

export default function ViewEvaluationModal({ data, open, setOpen }) {
  const [evaluation, setEvaluation] = useState(data);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState("start");

  const handleCloseModal = (value) => {
    setOpen(value);
  };

  useMemo(() => {
    if (data) {
      setEvaluation(data);
      setLoading(false);
      switch (data.estado) {
        case 1:
          setState("start");
          break;
        case 2:
          setState("finish");
          break;
        default:
          setState("start");
          break;
      }
    }
  }, [data]);

  // console.log(evaluation);

  const changeState = async (e) => {
    e.preventDefault();
    await api
      .patch(`api/${state}_evaluation/`, {
        evaluation_id: evaluation.id_evaluation,
      })
      .then((response) => {
        setOpen(false);
        eventDispatcher("responseEvent", response);
      })
      .catch((error) => {
        eventDispatcher("responseEvent", error, "danger");
      });
  };

  return (
    <Fragment>
      <ModalFrame
        ModalTitle="Información de la evaluación"
        open={open}
        onClose={handleCloseModal}
      >
        <Box
          component="header"
          sx={{
            display: "flex",
            mt: 2,
            mb: 1,
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
            // alignItems: { xs: "start", sm: "center" },
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: "100%",
            minWidth: 500,
            minHeight: 100,
          }}
        >
          {!loading ? (
            <>
              <Stack
                direction="column"
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <Typography level="h3">Nombre: {evaluation.name}</Typography>
                <Typography level="title-sm">
                  Rúbrica: {evaluation.rubric}
                </Typography>
                <Typography>
                  Estado:{" "}
                  <Chip color={evaluation.estado === 2 ? "success" : "primary"}>
                    {interpretEvaluationState(evaluation.estado)}
                  </Chip>
                </Typography>
                {/* <Typography level="title-md">
                  Escala: 1 - {evaluation.scale.Upper_limit}
                </Typography> */}
              </Stack>
            </>
          ) : (
            <Stack direction="column" gap={1}>
              <Skeleton
                variant="text"
                level="h1"
                animation="wave"
                loading
                width={400}
                height={40}
              />
              {/* <Skeleton
                variant="text"
                level="title-md"
                animation="wave"
                loading
                width={200}
                height="title-md"
              /> */}
            </Stack>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column-reverse", sm: "row-reverse" },
            justifyContent: "end",
          }}
        >
          <Button
            variant="outlined"
            color="neutral"
            onClick={() => setOpen(false)}
          >
            Cerrar
          </Button>
          {evaluation.estado != 3 && (
            <Button
              variant="soft"
              color={state === "start" ? "success" : "danger"}
              onClick={changeState}
            >
              {state === "start" ? "Iniciar" : "Finalizar"} evaluación
            </Button>
          )}
          {/* <CreateStudent course={courseId} />
              <ImportUsersModal courseId={courseId} isStudent /> */}
        </Box>
      </ModalFrame>
    </Fragment>
  );
}
