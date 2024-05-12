import { Routes, Route, Navigate } from 'react-router-dom';
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
import Grades from './pages/student/Grades';
import Result from './pages/student/Result';
import Feedback from './pages/student/Feedback';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />
}

// function CreatePasswordAndLogout() {
//   localStorage.clear();
//   return <Navigate to="/create-password" />
// }

function App() {

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route
          path="/admin/*"
          element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>}
          errorElement={<NotFound />}
        >
          <Route index element={<ManageAdmin />} />
          <Route path='manage/teachers' element={<ManageTeachers />} />
          <Route path='manage/courses' element={<ManageCourses />} />
          <Route path='manage/scales' element={<ManageScales />} />
        </Route>

        <Route path='/profesor/*' element={<ProtectedRoute allowedRoles={['teacher']}><TeacherPage /></ProtectedRoute>}>

          {/* TODO COMPONENTE PARA AJUSTES DEL PROFESOR */}
          <Route path='ajustes' />

        </Route>
        <Route path="/estudiante/*"
        element={<ProtectedRoute allowedRoles={['student']}><StudentPage /></ProtectedRoute>}>
          <Route index element={<Grades />} />
          
          <Route path='resultados' element={<Result />} />
          <Route path='materiales' element={<Feedback />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/crear-contraseña" element={<CreatePassword />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />

        {/*esto está bien???*/}
        <Route index element={<Grades />} />
        <Route path='/manage/result' element={<Result />} />
        <Route path='/manage/feedback' element={<Feedback />} />

      </Routes>
    </CssVarsProvider>
  )
}

export default App
