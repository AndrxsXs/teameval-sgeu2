import { Fragment } from "react";

import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";

import SearchIcon from "@mui/icons-material/Search";

import CreateCourse from "../../components/admin/CreateCourse";
import CourseTable from "../../components/CourseTable";

export default function ManageCourses() {
  //   const location = useLocation();
  //   const isCoursePage =
  //     location.pathname === ("/admin/manage/courses" || "/admin/manage/courses/");

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
          Cursos
        </Typography>

        <CreateCourse />
      </Box>
      <Stack
        component="section"
        direction="row"
        gap={2}
        // sx={{
        //     alignSelf: 'flex-start',
        // }}

        sx={{
          alignSelf: "flex-start",
          minWidth: "50%",
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "nowrap",
          justifyContent: "flex-start",
          gap: 1.5,
          // '& > *': {
          //     minWidth: { xs: '120px', md: '160px' },
          // },
        }}
      >
        <FormControl sx={{ flex: 1, maxWidth: "70%" }} size="sm">
          <FormLabel>Buscar curso</FormLabel>
          <Input
            // value={searchQuery}
            // onChange={handleSearchChange}
            size="sm"
            placeholder="Código, nombre, docente, etc."
            startDecorator={<SearchIcon />}
          />
        </FormControl>
      </Stack>
      <CourseTable />
    </Fragment>
  );
}
