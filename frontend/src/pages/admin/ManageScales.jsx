import { Fragment } from "react";

// import CriteriaTable from "../../components/admin/CriteriaTable";
// import CriteriaTable from "../../components/CriteriaTable";

// import { Box, Typography, Button, Stack } from "@mui/joy";
// import Add from "@mui/icons-material/Add";
// import EditRoundedIcon from "@mui/icons-material/EditRounded";

import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";

import RubricList from "../../components/teacher/RubricList";
import CreateRubric from "../../components/teacher/CreateRubric";

// const headCells = [
//   {
//     id: "text",
//     numeric: false,
//     disablePadding: true,
//     label: "Criterio",
//   },
//   // {
//   //   id: "scale",
//   //   numeric: false,
//   //   disablePadding: false,
//   //   label: "Descripción de la escala",
//   // },
// ];

export default function ManageScales() {
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
          alignItems: "flex-start",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Stack
          direction="column"
          sx={{
            maxWidth: "60%",
          }}
        >
          <Typography level="h2" component="h1">
            Escalas y criterios
          </Typography>

          <Typography level="body-md">
            Agregue y edite los criterios predeterminados que podrán usar los
            docentes en sus rúbricas.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <CreateRubric />
          {/* <Button color="primary" startDecorator={<Add />} size="sm">
            Agregar criterios
          </Button> */}
          {/* <Button
            color="neutral"
            variant="outlined"
            startDecorator={<EditRoundedIcon />}
            disabled
          >
            Editar criterios
          </Button> */}
        </Box>
      </Box>
      {/* <CriteriaTable headCells={headCells} /> */}
      <RubricList />
    </Fragment>
  );
}
