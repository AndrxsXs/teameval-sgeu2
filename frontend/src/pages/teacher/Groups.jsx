import { useParams } from "react-router";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import GroupsTable from "../../components/teacher/groups/GroupsTable";
import CreateGroup from "../../components/teacher/groups/CreateGroup";

export default function Groups() {
  const { courseId } = useParams();
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
          Grupos
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <CreateGroup course={courseId} />
        </Box>
      </Box>
      <GroupsTable course={courseId} />
    </>
  );
}
