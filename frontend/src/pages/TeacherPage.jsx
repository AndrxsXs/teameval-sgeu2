/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import api from "../api";

import CourseView from "./teacher/course/CourseView";

import AddStudent from "./teacher/course/AddStudent";
import DisableStudent from "./teacher/course/DisableStudent";
import Groups from "./teacher/Groups";
import ScalesCriteria from "./teacher/ScalesCriteria";
import Report from "./teacher/Report";
import MainTeacherView from "./teacher/MainTeacherView";
import ImportStudent from "../components/teacher/ImportStudent";
import Resources from "./teacher/Resources";

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
          <Route path="subir" element={<ImportStudent />} />
          <Route path="deshabilitar-estudiante" element={<DisableStudent />} />
          <Route path="grupos" element={<Groups />} />
          <Route path="escalas" element={<ScalesCriteria />} />
          <Route path="informes" element={<Report />} />
          <Route path="recursos" element={<Resources />} />
        </Route>
      </Routes>
    </>
  );
}

export default TeacherPage;
