/* eslint-disable react/prop-types */
import { Routes, Route, Navigate } from "react-router-dom";
// import { interpretNumbers } from './utils/interpretNumbers';

import {
  // React,
  useState,
  useEffect,
} from "react";

import {
  // Alert as MuiAlert,
  Snackbar,
  IconButton,
  Typography,
} from "@mui/joy";

// import SimpleSnackbar from './components/SimpleSnackbar';

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

import { CssVarsProvider } from "@mui/joy/styles";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
// import Login from './pages/auth/Login';
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
// import CreatePassword from './pages/auth/CreatePassword';

// import ManageAdmin from "./pages/admin/ManageAdmin";
// import ManageTeachers from "./pages/admin/ManageTeachers"
// import ManageCourses from "./pages/admin/ManageCourses";
// import ManageScales from "./pages/admin/ManageScales";

import MainTeacherView from "./pages/teacher/MainTeacherView";
import Grades from "./pages/student/Grades";

import Result from "./pages/student/Result";
import Feedback from "./pages/student/Feedback";
import ViewEvaluations from "./pages/student/evaluation/ViewEvaluations";
import ViewRubric from "./pages/student/evaluation/ViewRubric";
import ViewResults from "./pages/student/ViewResults";
import ViewFeedback from "./pages/student/ViewFeedback";
import ForgotPassword from "./pages/auth/ForgotPassword";
import CodePassword from "./components/CodePassword";
import LoginPage from "./pages/auth/LoginPage";
import CreatePasswordPage from "./pages/auth/CreatePasswordPage";
import { CssBaseline } from "@mui/material";
import Evaluate from "./pages/student/evaluation/Evaluate";
// import ImportStudent from './components/teacher/ImportStudent';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" replace />;
}

const USER_ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
};

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

function App() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("primary");
  const [evaluationData, setEvaluationData] = useState([]);

  const handleResponseEvent = (event) => {
    // console.log('Evento recibido:', event);
    const { message, severity } = event.detail;
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // console.log(snackbarOpen)

  useEffect(() => {
    window.addEventListener("responseEvent", handleResponseEvent);
    return () => {
      window.removeEventListener("responseEvent", handleResponseEvent);
    };
  }, []);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/recuperar" element={<ForgotPassword />} />
        <Route path="login/recuperar/codigo" element={<CodePassword />} />
        <Route path="/crear-contrasena" element={<CreatePasswordPage />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <AdminPage />
            </ProtectedRoute>
          }
          errorElement={<NotFound />}
        >
          <Route path="settings" />
        </Route>

        <Route
          path="/profesor/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.TEACHER]}>
              <TeacherPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<MainTeacherView />} />
          <Route path="settings" />
        </Route>

        <Route
          path="/estudiante/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
              <StudentPage />
            </ProtectedRoute>
          }
          errorElement={<NotFound />}
        >
          <Route
            index
            element={<Grades setEvaluationData={setEvaluationData} />}
          />
          {/* <Route path="evaluar/:curso" element={<ViewEvaluations />} /> */}
          <Route
            path="evaluar/:curso"
            element={<Evaluate evaluationData={evaluationData} />}
          />
          <Route path="./rubrica" element={<ViewRubric />} />

          <Route path="resultados" element={<Result />} />
          <Route path="resultados/:courseId" element={<ViewEvaluations />} />
          <Route
            path="resultados/:courseId/:evalId"
            element={<ViewResults />}
          />
          <Route path="retroalimentacion" element={<Feedback />} />
          <Route path="retroalimentacion/feedback" element={<ViewFeedback />} />
        </Route>

        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* <SimpleSnackbar
        onOpen={snackbarOpen}
        // onOpen={true}
        reason={snackbarSeverity}
        description={snackbarMessage}

      /> */}

      <Snackbar
        open={snackbarOpen}
        // open={true}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        color={snackbarSeverity === "success" ? "success" : "danger"}
        variant="soft"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        startDecorator={
          snackbarSeverity === "success" ? (
            <CheckCircleRoundedIcon />
          ) : (
            <ErrorRoundedIcon />
          )
        }
        endDecorator={
          <IconButton
            onClick={() => setSnackbarOpen(false)}
            variant="soft"
            // size="sm"
            color={snackbarSeverity === "success" ? "success" : "danger"}
          >
            <CloseRoundedIcon />
          </IconButton>
        }
      >
        <Typography
          color={snackbarSeverity === "success" ? "success" : "danger"}
          level="title-md"
        >
          {snackbarMessage}
        </Typography>
      </Snackbar>
    </CssVarsProvider>
  );
}

export default App;
