/* eslint-disable react/prop-types */
import { Fragment, useState, useEffect } from "react";

import api from "../../api";

import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";

import { Link, useParams } from "react-router-dom";

import Radio from "@mui/joy/Radio";

function RubricCard({ rubric, selectMode, onSelect, selected, handleSelect }) {
  const handleSelectRubric = () => {
    handleSelect(); // Llamar a la función pasada por el padre
    onSelect(rubric); // Llamar a la función de devolución de llamada onSelect
  };

  return (
    <Fragment>
      {!selectMode ? (
        <Link
          to={`./${rubric.id}`}
          // to="#"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Card
            sx={{
              width: 300,
              height: 150,
              borderRadius: "sm",
              boxShadow: "sm",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 2,
              transition: "box-shadow 0.3s",
              "&:hover": {
                boxShadow: "none",
              },
              overflow: "hidden",
            }}
          >
            <CardContent>
              <Stack
                component="header"
                direction="row"
                justifyContent="space-between"
              >
                <Typography level="title-md">{rubric.name}</Typography>
                {selectMode && ( // Renderizar el radio button si selectMode es true
                  <Radio
                    required
                    overlay
                    checked={selected} // Usar el estado de selección pasado por el padre
                    onChange={handleSelectRubric} // Llamar a la función de selección
                    sx={{ mr: 1, alignSelf: "flex-end" }} // Margen derecho para separar del contenido
                  />
                )}
              </Stack>
              <Typography level="body-xs" color="textSecondary">
                Escala: 1 - {rubric.scale.length}
              </Typography>
              <Typography level="body-xs" color="textSecondary">
                {rubric.standards.length}{" "}
                {rubric.standards.length === 1 ? "criterio:" : "criterios:"}
              </Typography>
              <Typography>
                <Stack
                  direction="column"
                  sx={{
                    maxHeight: "3.6em", // Altura máxima deseada para el contenido de texto
                    overflow: "hidden",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "3.2em", // Altura del efecto de desvanecimiento
                      backgroundImage:
                        "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))",
                    },
                  }}
                >
                  {rubric.standards.map((standard, index) => (
                    <Typography
                      key={index}
                      level="body-xs"
                      color="textSecondary"
                    >
                      {standard.description}
                    </Typography>
                  ))}
                </Stack>
              </Typography>
            </CardContent>
          </Card>
        </Link>
      ) : (
        <Card
          sx={{
            width: 300,
            height: 150,
            borderRadius: "sm",
            boxShadow: "sm",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 2,
            transition: "box-shadow 0.3s",
            "&:hover": {
              boxShadow: "none",
            },
            overflow: "hidden",
          }}
        >
          <CardContent>
            <Stack
              component="header"
              direction="row"
              justifyContent="space-between"
            >
              <Typography level="title-md">{rubric.name}</Typography>
              {selectMode && ( // Renderizar el radio button si selectMode es true
                <Radio
                  required
                  overlay
                  checked={selected}
                  onChange={handleSelect}
                  sx={{ mr: 1, alignSelf: "flex-end" }} // Margen derecho para separar del contenido
                  slotProps={{
                    action: ({ checked }) => ({
                      // Cambiar el color del borde si el radio está seleccionado
                      sx: (theme) => ({
                        ...(checked && {
                          inset: -1,
                          border: "3px solid",
                          borderColor: theme.vars.palette.primary[500],
                        }),
                      }),
                    }),
                  }}
                />
              )}
            </Stack>
            <Typography level="body-xs" color="textSecondary">
              Escala: 1 - {rubric.scale.length}
            </Typography>
            <Typography level="body-xs" color="textSecondary">
              {rubric.standards.length}{" "}
              {rubric.standards.length === 1 ? "criterio:" : "criterios:"}
            </Typography>
            <Typography>
              {rubric.standards.map((standard, index) => (
                <Typography key={index} level="body-xs" color="textSecondary">
                  {standard.description}
                </Typography>
              ))}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Fragment>
  );
}

export default function RubricList(props) {
  const { selectMode, onSelect } = props;
  const { courseId } = useParams();

  const [rubrics, setRubrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRubricId, setSelectedRubricId] = useState(null); // Nuevo estado

  useEffect(() => {
    const fetchRubrics = async () => {
      setLoading(true);
      const token = localStorage.getItem("ACCESS_TOKEN");
      await api
        .get(`api/list_rubric/${courseId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setRubrics(response.data);
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

    fetchRubrics();
  }, [courseId]);

  return (
    <Fragment>
      <Box
        component="section"
        width="100%"
        height="100%"
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 2,
          overflow: "auto",
          justifyContent: "flex-start",
          alignContent: "start",
          padding: 1,
        }}
      >
        {!loading
          ? rubrics.map((rubric) => (
              <RubricCard
                key={rubric.id}
                rubric={rubric}
                selectMode={selectMode}
                onSelect={onSelect}
                selected={rubric.id === selectedRubricId} // Pasar el estado de selección
                handleSelect={() => {
                  setSelectedRubricId(rubric.id);
                  onSelect(rubric);
                }}
              />
            ))
          : Array.from(new Array(9)).map((_, index) => (
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
        {rubrics.length === 0 && !loading && !selectMode ? (
          <Stack direction={{ xs: "column", sm: "row" }} width="100%">
            <Typography level="body-sm" component="p">
              No hay rúbricas disponibles, cree una nueva usando el botón{" "}
              <Typography level="title-sm" color="primary">
                Nueva rúbrica
              </Typography>
              .
            </Typography>
          </Stack>
        ) : rubrics.length === 0 && !loading ? (
          <Stack direction={{ xs: "column", sm: "row" }} width="100%">
            <Typography level="body-sm" component="p">
              No hay rúbricas disponibles, cree una nueva usando el botón{" "}
              <Typography level="title-sm" color="primary">
                Nueva rúbrica
              </Typography>{" "}
              en el menú de escalas y criterios de la barra lateral.
            </Typography>
          </Stack>
        ) : null}
      </Box>
    </Fragment>
  );
}
