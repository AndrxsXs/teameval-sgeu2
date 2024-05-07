import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { CssVarsProvider } from "@mui/joy/styles"
import CssBaseline from "@mui/joy/CssBaseline"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/pages/AdminPage.css"
import Typography from '@mui/joy/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/joy/Button'
import PersonAddRounded from '@mui/icons-material/PersonAddRounded';
import MainTeacherView from "../pages/teacher/MainTeacherView";
import CourseView from '../pages/teacher/CourseView';

function TeacherPage() {
    return (
        <>
            <Routes>
            <Route path='/' element={<MainTeacherView />}/>
  
            <Route path='/curso' element={<CourseView />}  />
            </Routes>
        </>
    )
}

export default TeacherPage