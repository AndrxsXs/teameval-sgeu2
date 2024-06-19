import { Fragment } from "react";
import { useParams } from "react-router-dom";

import EvaluationList from "../../components/teacher/EvaluationList";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

export default function Report() {
  const { courseId } = useParams();
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
        <Typography level="h2" component="h1">
          Informes
        </Typography>
      </Box>
      <Typography level="body-sm">
        Seleccione una evaluación para ver su informe detallado.
      </Typography>

      <EvaluationList courseId={courseId} reportMode />

      {/* <SearchField course onSearchChange={handleSearchChange} /> */}
      {/* <ViewReportDetailedModal course={courseId} /> */}
    </Fragment>
  );
}
