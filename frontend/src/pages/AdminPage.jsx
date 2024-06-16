/* eslint-disable react/prop-types */
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import {
  Routes,
  Route,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useEffect } from "react";

import AdminSidebar from "../components/admin/AdminSidebar";
import "../styles/pages/admin/AdminPage.css";
import ManageAdmin from "./admin/ManageAdmin";
import ManageTeachers from "../pages/admin/ManageTeachers";
import ManageCourses from "./admin/ManageCourses";
import ManageScales from "./admin/ManageScales";
import CourseDetailed from "../components/admin/CourseDetailed";
import { Box } from "@mui/material";

function AdminPage({ userData }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/admin" || location.pathname === "/admin/") {
      navigate("/admin/manage");
    }
  }, [navigate, location]);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <Box className="container" sx={{ width: "100%" }}>
        <CssBaseline />
        <AdminSidebar userData={userData} />

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
            height: "100dvh",
            width: "100%",
            gap: 1,
            margin: "auto 0",
          }}
        >
          <Routes>
            <Route path="manage" element={<Outlet />}>
              <Route index element={<ManageAdmin />} />
              <Route path="teachers" element={<ManageTeachers />} />
              <Route path="courses" element={<ManageCourses />}>
                <Route path=":courseId" element={<CourseDetailed />} />
              </Route>
              <Route path="scales" element={<ManageScales />} />
            </Route>
          </Routes>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}

export default AdminPage;
