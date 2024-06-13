import { Fragment, useState } from "react";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

import ManageCourse from "../../components/admin/ManageCourse";
import CourseTable from "../../components/CourseTable";
import SearchField from "../../components/admin/SearchField";

import { Outlet, useLocation } from "react-router-dom";

export default function ManageCourses() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };
  const location = useLocation();
  const isCoursePage =
    location.pathname === ("/admin/manage/courses" || "/admin/manage/courses/");

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

        <ManageCourse />
      </Box>
      {!isCoursePage ? (
        <Outlet />
      ) : (
        <Fragment>
          <SearchField course onSearchChange={handleSearchChange} />

          <CourseTable searchTerm={searchTerm} />
        </Fragment>
      )}
    </Fragment>
  );
}
