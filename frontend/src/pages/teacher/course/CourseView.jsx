/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

import { Outlet, useParams, useLocation } from "react-router-dom";

import api from "../../../api";

import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import TeacherSidebar from "../../../components/teacher/TeacherSidebar";
import TeacherBreadcrumbs from "../../../components/teacher/TeacherBreadcrumbs";
import { CssVarsProvider } from "@mui/joy/styles";

function CourseView({ userData }) {
  const location = useLocation();
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState({});
  const route = `${location.pathname.split("/")[1]}`;
  const [loading, setLoading] = useState(false);
  // console.log(route);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("ACCESS_TOKEN");
        const response = await api.get(`api/course_info/${courseId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setCourseData(response.data);
          setLoading(false);
        }
        // const data = response.data;
        // console.log(data);
      } catch (error) {
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: `${error.response.status} ${error.response.statusText}`,
              severity: "danger",
            },
          })
        );
        setLoading(false);
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
            <TeacherBreadcrumbs
              HomeRoute={route}
              CourseLabel={courseData.name}
              loading={loading}
            />
            <Outlet context={{ courseId }} />
          </Box>
        </Box>
      </CssVarsProvider>
    </>
  );
}

export default CourseView;
