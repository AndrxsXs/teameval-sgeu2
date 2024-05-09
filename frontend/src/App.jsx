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

        <Route path="/admin//*" element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} />
        {/* <Route path='/admin' element={<AdminPage />} /> */}
        <Route path='/profesor//*' element={<ProtectedRoute allowedRoles={['teacher']}><TeacherPage /></ProtectedRoute>} />
        <Route path="/estudiante//*" element={<ProtectedRoute allowedRoles={['student']}><StudentPage /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/crear-contraseña" element={<CreatePassword />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </CssVarsProvider>
  )
}

export default App
