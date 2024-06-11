import { Fragment } from "react";

import CriteriaTable from "../../components/admin/CriteriaTable";

import { Box, Typography, Button, Stack } from "@mui/joy";
import Add from "@mui/icons-material/Add";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

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
            Agregue y edite los criterios predeterminados para las escalas de evaluación.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column-reverse", sm: "row-reverse" },
          }}
        >
          <Button color="primary" startDecorator={<Add />} size="sm">
            Agregar criterios
          </Button>
          <Button
            color="neutral"
            variant="outlined"
            startDecorator={<EditRoundedIcon />}
            disabled
          >
            Editar criterios
          </Button>
        </Box>
      </Box>
      <CriteriaTable />
    </Fragment>
  );
}
