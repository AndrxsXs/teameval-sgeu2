/* eslint-disable react/prop-types */
import { Outlet, useParams } from "react-router-dom";

import api from "../../../api";

import { Box } from "@mui/joy";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import TeacherSidebar from "../../../components/teacher/TeacherSidebar";
import { useEffect } from "react";

function CourseView({ userData }) {
  const { courseId } = useParams();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("ACCESS_TOKEN");
        const response = await api.get(`api/course_info/${courseId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        console.log(data);
      } catch (error) {
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: `${error.response.status} ${error.response.statusText}`,
              severity: "danger",
            },
          })
        );
      }
    };
    fetchCourse();
  }, [courseId]);

  return (
    <>
      <CssVarsProvider disableTransitionOnChange>
        <Box className="container" sx={{}}>
          <CssBaseline />
          <TeacherSidebar userData={userData} />

          <Box
            component="main"
            className="main-container"
            sx={{
              px: { xs: 2, md: 6 },
              pt: {
                xs: "calc(12px + var(--Header-height))",
                sm: "calc(12px + var(--Header-height))",
                md: 3,
              },
              pb: { xs: 2, sm: 2, md: 3 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              height: "100dvh",
              gap: 1,
            }}
          >
            <Outlet context={{ courseId }} />
          </Box>
        </Box>
      </CssVarsProvider>
    </>
  );
}

export default CourseView;
