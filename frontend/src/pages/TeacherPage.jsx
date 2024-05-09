import { Routes, Route } from 'react-router-dom'
import "../styles/pages/AdminPage.css"
import MainTeacherView from "../pages/teacher/MainTeacherView";
import CourseView from './teacher/course/CourseView';
import Groups from '../pages/teacher/Groups';
import ScalesCriteria from '../pages/teacher/ScalesCriteria';
import Report from '../pages/teacher/Report';

function TeacherPage() {
    return (
        <>
            <Routes>
                <Route path='/' element={<MainTeacherView />} />
                <Route path='/curso' element={<CourseView/>} />
                <Route path='/curso/añadir' element={<CourseView/>} />
                <Route path='/curso/grupos' element={<Groups />} />
                <Route path='/curso/escalas' element={<ScalesCriteria />} />
                <Route path='/curso/informe' element={<Report />} />
            </Routes>
        </>
    )
}

export default TeacherPage