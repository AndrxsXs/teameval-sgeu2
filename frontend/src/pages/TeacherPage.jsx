/* eslint-disable react/prop-types */
import { Routes, Route, Outlet } from "react-router-dom";

import CourseView from "./teacher/course/CourseView";

import AddStudent from "./teacher/course/AddStudent";
import Groups from "./teacher/Groups";
import ScalesCriteria from "./teacher/ScalesCriteria";
import Report from "./teacher/Report";
import MainTeacherView from "./teacher/MainTeacherView";
import Resources from "./teacher/Resources";
import Evaluation from "./teacher/Evaluation";
import ViewRubric from "./teacher/course/ViewRubric";

function TeacherPage({ userData }) {
  return (
    <>
      <Routes>
        <Route index element={<MainTeacherView userData={userData} />} />
        <Route
          path="/curso/:courseId/*"
          element={<CourseView userData={userData} />}
        >
          <Route index element={<AddStudent />} />
          <Route path="grupos" element={<Groups />} />
          <Route path="escalas" element={<Outlet />}>
            <Route index element={<ScalesCriteria />} />
            <Route path=":rubric" element={<ViewRubric />} />
          </Route>
          <Route path="informes" element={<Report />} />
          <Route path="evaluaciones" element={<Evaluation />} />
          <Route path="recursos" element={<Resources />} />
        </Route>
      </Routes>
    </>
  );
}

export default TeacherPage;
