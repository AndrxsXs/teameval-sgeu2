/* eslint-disable react/prop-types */

import { Routes, Route } from 'react-router-dom'
import CourseView from './teacher/course/CourseView';

import AddStudent from './teacher/course/AddStudent'
import DisableStudent from "./teacher/course/DisableStudent"
import Groups from './teacher/Groups'
import ScalesCriteria from './teacher/ScalesCriteria'
import Report from './teacher/Report'
import MainTeacherView from './teacher/MainTeacherView';
import ImportStudent from '../components/teacher/ImportStudent';

function TeacherPage({ userData }) {
    return (
      <>
        <Routes>
          <Route index element={<MainTeacherView />} />
          <Route path='/curso/*' element={<CourseView userData={userData} />}>
            <Route path='importar-estudiante/*' element={<AddStudent />}>
              <Route path='subir' element={<ImportStudent />} />
            </Route>
            <Route path='deshabilitar-estudiante' element={<DisableStudent />} />
            <Route path='grupos' element={<Groups />} />
            <Route path='escalas' element={<ScalesCriteria />} />
            <Route path='informes' element={<Report />} />
            <Route path='recursos' element={<Report />} />
          </Route>
        </Routes>

        
      </>
    )
  }

export default TeacherPage





