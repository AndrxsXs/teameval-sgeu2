/* eslint-disable react/prop-types */
import { Fragment, useMemo, useState } from "react";

import api from "../../api";
import eventDispatcher from "../../utils/eventDispacher";

import CriteriaTableInfo from "../CriteriaTableInfo";
import ModalFrame from "../ModalFrame";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";

export default function ViewRubricModal({ data, open, setOpen }) {
  const [rubric, setRubric] = useState();
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changesMade, setChangesMade] = useState(false);
  const [updatedData, setUpdatedData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCloseModal = (value) => {
    setOpen(value);
  };

  useMemo(() => {
    if (data) {
      setId(data.id);
    }
  }, [data]);

  useMemo(() => {
    const fetchRubric = async () => {
      await api
        .get(`api/info_rubric/${id}/`)
        .then((response) => {
          setRubric(response.data);
          setLoading(false);
        })
        .catch((error) => {
          eventDispatcher("responseEvent", error, "danger");
          setLoading(false);
        });
    };
    // fetchRubric();
    if (open && id != (null || undefined)) {
      fetchRubric();
    }
  }, [open, id]); // Agregar 'open' y 'rubricId' como dependencias

  const editRubric = async () => {
    setSubmitting(true);

    // Crear una nueva estructura de datos para los estándares actualizados
    const updatedStandards = updatedData;

    // Crear una nueva estructura de datos para la rúbrica actualizada
    const updatedRubric = {
      ...rubric, // Copiar todas las propiedades originales de la rúbrica
      standards: updatedStandards, // Reemplazar solo los estándares con los datos actualizados
    };

    await api
      .put(`api/update_rubric`, updatedRubric, {
        params: {
          rubric_id: id,
        },
      })
      .then((response) => {
        setRubric(response.data); // Actualizar el estado rubric con la respuesta del servidor
        setChangesMade(false);
        eventDispatcher("responseEvent", response);
        setSubmitting(false);
      })
      .catch((error) => {
        eventDispatcher("responseEvent", error, "danger");
        setSubmitting(false);
      });
  };

  return (
    <Fragment>
      <ModalFrame
        ModalTitle="Información de la rúbrica"
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
            alignItems: { xs: "start", sm: "center" },
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {!loading ? (
            <>
              <Stack direction="column">
                <Typography level="h3">{rubric.name}</Typography>
                <Typography level="title-md">
                  Escala: 1 - {rubric?.scale?.Upper_limit || ""}
                </Typography>
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
              <Skeleton
                variant="text"
                level="title-md"
                animation="wave"
                loading
                width={200}
                height="title-md"
              />
            </Stack>
          )}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            {changesMade && (
              <>
                <Button
                  variant="soft"
                  color="success"
                  onClick={editRubric}
                  loading={submitting}
                >
                  Guardar cambios
                </Button>
              </>
            )}
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              {changesMade ? "Descartar y volver" : "Volver"}
            </Button>
            {/* <CreateStudent course={courseId} />
              <ImportUsersModal courseId={courseId} isStudent /> */}
          </Box>
        </Box>
        <CriteriaTableInfo
          data={data}
          updatedData={setUpdatedData}
          setChangesMade={setChangesMade}
          onStandardsChange={setUpdatedData}
        />
      </ModalFrame>
    </Fragment>
  );
}
