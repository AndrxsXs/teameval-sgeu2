import { Box, Typography, Table } from "@mui/joy";
import ReportTable from "../../components/ReportTable";
import SearchField from "../../components/admin/SearchField";
import React, { Fragment } from 'react';
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import ReportDetailed from "../../components/teacher/ReportDetailed";
import { useParams } from 'react-router-dom';


export default function Report() {

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };
  const location = useLocation();
  const isCoursePage =
    location.pathname === ("/admin/manage/courses" || "/admin/manage/courses/");

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
      
        <Fragment>
          <SearchField course onSearchChange={handleSearchChange} />
          <ReportDetailed course={courseId} />
        </Fragment>
      
    </Fragment>

  );
}
