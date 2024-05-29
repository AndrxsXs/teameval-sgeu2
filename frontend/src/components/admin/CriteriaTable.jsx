import { Fragment, useState } from "react";

import { Box, Sheet, Table, Typography, CircularProgress } from "@mui/joy";

export default function CriteriaTable() {
  const [loading, setLoading] = useState(false);

  const criterios = [
    {
      nombre: "Respeto",
      descripcion:
        "Respeto a los demás y a las normas de convivencia del lugar",
    },
    {
      nombre: "Responsabilidad",
      descripcion: "Cumplimiento de las tareas y responsabilidades asignadas",
    },
    {
      nombre: "Puntualidad",
      descripcion: "Cumplimiento de horarios y fechas establecidas",
    },
    {
      nombre: "Colaboración",
      descripcion: "Disposición para ayudar y colaborar con los demás",
    },
    {
      nombre: "Comunicación",
      descripcion: "Capacidad para expresarse y escuchar a los demás",
    },
    {
      nombre: "Trabajo en equipo",
      descripcion:
        "Capacidad para trabajar en equipo y alcanzar objetivos comunes",
    },
    {
      nombre: "Creatividad",
      descripcion: "Capacidad para proponer ideas y soluciones innovadoras",
    },
    {
      nombre: "Iniciativa",
      descripcion: "Capacidad para tomar decisiones y actuar por cuenta propia",
    },
    {
      nombre: "Adaptabilidad",
      descripcion: "Capacidad para adaptarse a nuevas situaciones y cambios",
    },
    {
      nombre: "Liderazgo",
      descripcion: "Capacidad para guiar y motivar a los demás",
    },
  ];

  return (
    <Fragment>
      <Sheet
        component="section"
        className="TableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "flex" },
          flexFlow: "column",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="Tabla de Criterios"
          stickyHeader
          hoverRow
          borderAxis="bothBetween"
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "24px",
            "& thead th:nth-of-type(1)": { width: "20%" },
          }}
        >
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {criterios.map((criterio) => (
              <tr key={criterio.nombre}>
                <td>
                  <Typography level="body-sm">{criterio.nombre}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {criterio.descripcion}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              minHeight: "41px",
              borderTop:
                criterios && criterios.length < 1 ? "transparent" : "1px solid",
              borderTopColor: "divider",
            }}
          >
            <CircularProgress size="md" />
            <Typography level="body-xs" sx={{ userSelect: "none" }}>
              <Fragment>Cargando datos...</Fragment>
            </Typography>
          </Box>
        ) : (
          <Typography
            component="span"
            level="body-xs"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              minHeight: "41px",
              borderTop:
                criterios && criterios.length < 1 ? "transparent" : "1px solid",
              borderTopColor: "divider",
              userSelect: "none",
            }}
          >
            {criterios && criterios.length === 0 ? (
              <Fragment>No hay criterios</Fragment>
            ) : (
              <Fragment>Nada más por aquí</Fragment>
            )}
          </Typography>
        )}
      </Sheet>
    </Fragment>
  );
}
