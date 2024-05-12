
import { Routes, Route } from 'react-router-dom'
import CourseView from './teacher/course/CourseView';

import AddStudent from './teacher/course/AddStudent'
import DisableStudent from "./teacher/course/DisableStudent"
import Groups from './teacher/Groups'
import ScalesCriteria from './teacher/ScalesCriteria'
import Report from './teacher/Report'

function TeacherPage() {
    return (
        <>
            <Routes>
                <Route path='/curso/*' element={<CourseView />}>
                    <Route path='estudiante/importar' element={<AddStudent />} />
                    <Route path='estudiante/deshabilitar' element={<DisableStudent />} />
                    <Route path='grupos' element={<Groups />} />
                    <Route path='escalas' element={<ScalesCriteria />} />
                    <Route path='informes' element={<Report />} />
                </Route>
            </Routes>
        </>
    )
}

export default TeacherPage





