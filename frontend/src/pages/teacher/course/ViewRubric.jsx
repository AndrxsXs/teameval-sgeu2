import { Fragment, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";
import eventDispatcher from "../../../utils/eventDispacher";

import CriteriaTableInfo from "../../../components/CriteriaTableInfo";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/material/Stack";
import Button from "@mui/joy/Button";
// import CreateStudent from "../../../components/teacher/CreateStudent";
// import ImportUsersModal from "../../../components/teacher/ImportUsersModal";

export default function ViewRubric() {
  const rubricId = useParams().rubric;
  const [loading, setLoading] = useState(true);
  const [rubric, setRubric] = useState({});
  const navigate = useNavigate();
  const [changesMade, setChangesMade] = useState(false);
  const [updatedData, setUpdatedData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  // const [originalRubric, setOriginalRubric] = useState({});

  // console.log(rubric)
  useEffect(() => {
    const fetchRubric = async () => {
      await api
        .get(`api/info_rubric/${rubricId}/`)
        .then((response) => {
          setRubric(response.data);
          // setOriginalRubric(response.data);
          setLoading(false);
        })
        .catch((error) => {
          eventDispatcher("responseEvent", error);
          setLoading(false);
        });
    };
    fetchRubric();
  }, [rubricId]);

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
          rubric_id: rubricId,
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
              <Typography level="h2" component="h1">
                {rubric.name}
              </Typography>
              <Typography level="title-md">
                Escala: 1 - {rubric.scale.Upper_limit}
              </Typography>
            </Stack>
          </>
        ) : (
          <Skeleton
            variant="text"
            level="h1"
            animation="wave"
            loading
            width={400}
            height={40}
          />
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
            onClick={() => navigate(-1)}
          >
            {changesMade ? "Descartar y volver" : "Volver"}
          </Button>
          {/* <CreateStudent course={courseId} />
              <ImportUsersModal courseId={courseId} isStudent /> */}
        </Box>
      </Box>
      <CriteriaTableInfo
        data={rubric}
        updatedData={setUpdatedData}
        setChangesMade={setChangesMade}
        onStandardsChange={setUpdatedData}
      />
    </Fragment>
  );
}
