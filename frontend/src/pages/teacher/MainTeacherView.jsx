import CardCurso from "../../components/CardCurso"
import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CourseView from '../../pages/teacher/CourseView';
import TopNavbar from "../../components/TopNavbar"
import Box from '@mui/material/Box'

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
        <Box
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
            <a href="/profesor/curso"><CardCurso name="Proyecto integrador I"/></a>
            <a href="/profesor/curso"><CardCurso name="Ciberseguridad"/></a>
        </Box>
        </Box>
    )
}