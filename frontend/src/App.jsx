/* eslint-disable react/prop-types */
import { Routes, Route, Navigate } from 'react-router-dom';
// import { interpretNumbers } from './utils/interpretNumbers';

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import Login from './pages/auth/Login';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import CreatePassword from './pages/auth/CreatePassword';

import ManageAdmin from "./pages/admin/ManageAdmin";
import ManageTeachers from "./pages/admin/ManageTeachers"
import ManageCourses from "./pages/admin/ManageCourses";
import ManageScales from "./pages/admin/ManageScales";

import MainTeacherView from './pages/teacher/MainTeacherView';

import Grades from './pages/student/Grades';
import Result from './pages/student/Result';
import Feedback from './pages/student/Feedback';
import ViewCursoStudent from './pages/student/evaluation/ViewCursoStudent';
import ViewRubric from './pages/student/evaluation/ViewRubric';
import RubricResult from './pages/student/RubricResult';
import ViewFeedback from './pages/student/ViewFeedback';
import ForgotPassword from './components/ForgotPassword';
import CodePassword from './components/CodePassword';
import ImportStudent from './components/teacher/ImportStudent';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" replace />
}

const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student'
}

function App() {

  return (

    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Routes>

        <Route path="/" element={

          <HomePage />

        } />
        <Route path="/login" element={<Login />} />
        <Route path="/login/recuperar" element={<ForgotPassword />} />
        <Route path="login/recuperar/codigo" element={<CodePassword />} />
        <Route path="/crear-contrasena" element={<CreatePassword />} />

        <Route
          path="/admin/*"
          element={<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}><AdminPage /></ProtectedRoute>}
          errorElement={<NotFound />}
        >
          <Route path='settings' />
        </Route>


        <Route path="/profesor/*" element={<ProtectedRoute allowedRoles={[USER_ROLES.TEACHER]}><TeacherPage /></ProtectedRoute>}>
          <Route index element={<MainTeacherView />} />
          <Route path='settings' />
        </Route>

        <Route path="/estudiante/*"
          element={<ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}><StudentPage /></ProtectedRoute>}
          errorElement={<NotFound />}
        >
          <Route index element={<Grades />} />
          <Route path='curso' element={<ViewCursoStudent />} />
          <Route path='curso/rubrica' element={<ViewRubric />} />

          <Route path='resultados' element={<Result />} />
          <Route path='resultados/calificación' element={<RubricResult />} />

          <Route path='retroalimentacion' element={<Feedback />} />
          <Route path='retroalimentacion/feedback' element={<ViewFeedback />} />

        </Route>



        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </CssVarsProvider>
  )
}

export default App