import { Box } from "@mui/joy";
import { Typography } from "@mui/joy";
import ManageRubric from "../../components/teacher/ManageRubric";
// import SearchRubric from "../../components/teacher/SearchRubric"
import RubricList from "../../components/teacher/RubricList";

export default function ScalesCriteria() {
  return (
    <>
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
          Escalas y criterios
        </Typography>

        <ManageRubric />
      </Box>
      <RubricList />
    </>
  );
}
