import CardCurso from "../../components/CardCurso"
import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CourseView from '../../pages/teacher/CourseView';
import TopNavbar from "../../components/TopNavbar"
import Box from '@mui/material/Box'
import "../../styles/pages/teacher/MainTeacherView.css"
import Typography from '@mui/joy/Typography'

export default function MainTeacherView() {

    return (
        <Box 
        sx={{
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
justifyContent: 'center'

        }}
        >
        <TopNavbar />

        <Typography level="h2" component="h1" sx={{ marginBottom: '30px', marginTop: '20px'}}>
        Mis cursos
        </Typography>

        <Box className="contenedor-curso"
            sx={{
                flex: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            minWidth: 0,
                            height: '100%',
                            alignSelf: 'center',
                            gap: 2,
                            justifyContent: 'center',
                            
            }}
        >
            <a href="/profesor/curso"><CardCurso name="Desarrollo de software"/></a>
            <a href="/profesor/curso"><CardCurso name="Base de datos"/></a>
            <a href="/profesor/curso"><CardCurso name="Ciberseguridad"/></a>
        </Box>
        </Box>
    )
}