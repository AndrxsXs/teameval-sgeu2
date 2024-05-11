
import { Routes, Route } from 'react-router-dom'
import "../styles/pages/AdminPage.css"
import MainTeacherView from "../pages/teacher/MainTeacherView";
import CourseView from './teacher/course/CourseView';

import "../styles/pages/StudentPage.css"



function TeacherPage() {
    return (
        <>
            <Routes>
                <Route path='/' element={<MainTeacherView />} />
                <Route path='/curso//*' element={<CourseView />} />
            </Routes>
        </>
    )
}

export default TeacherPage





