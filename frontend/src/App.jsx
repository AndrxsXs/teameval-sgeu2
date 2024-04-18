import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import CreatePassword from './pages/CreatePassword';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';
import ModeToggle from './components/ModeToggle';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />
}

function CreatePasswordAndLogout() {
  localStorage.clear();
  return <Navigate to="/create-password" />
}

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path='/home' element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />

        <Route path="/login" element={<Login />} />

        <Route path="/create-password" element={<CreatePassword />} />

        <Route path="/logout" element={<Logout />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
