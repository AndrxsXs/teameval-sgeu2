/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import StudentTable from "../teacher/StudentTable";
import ManageCourse from "../admin/ManageCourse";
import DisableCourse from "./DisableCourse";
import EnableCourse from "./EnableCourse";

import Card from "@mui/joy/Card";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Skeleton from "@mui/joy/Skeleton";

import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import api from "../../api";

function CourseActions(props) {
  const { course } = props;
  const navigate = useNavigate();

  return (
    <Stack className="course-details-button-group" direction="row" gap={2}>
      {course.course_status == true ? (
        <DisableCourse course={course} />
      ) : (
        <EnableCourse course={course} />
      )}
      <ManageCourse editMode course={course} />

      <Button
        variant="soft"
        onClick={() => navigate(-1)}
        startDecorator={<CloseRoundedIcon />}
      >
        Cerrar
      </Button>
    </Stack>
  );
}

export default function CourseDetailed() {
  const { courseCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [courseInfo, setCourseInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupInfo = async () => {
      await api
        .get(`api/course_info/${courseCode}/`)
        .then((response) => {
          setCourseInfo(response.data);
          // console.log(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    };
    fetchGroupInfo();

    window.addEventListener("course-updated", fetchGroupInfo);
    window.addEventListener("course-enabled", fetchGroupInfo);
    window.addEventListener("course-disabled", fetchGroupInfo);

    return () => {
      window.removeEventListener("course-updated", fetchGroupInfo);
      window.removeEventListener("course-enabled", fetchGroupInfo);
      window.removeEventListener("course-disabled", fetchGroupInfo);
    };
  }, [courseCode]);

  return (
    <>
      <Card
        sx={{
          p: 2,
          width: "clamp(100%, 100%, 1000px)",
          height: "100%",
          maxHeight: "82dvh",
          boxShadow: "md",
          "&:hover": {
            boxShadow: "none",
          },
          transition: "box-shadow 0.3s",
        }}
      >
        {!loading ? (
          <Fragment>
            <Stack
              className="course-details-header"
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <Stack className="course-details-info">
                <Typography level="h3" component="h2">
                  {courseInfo.name}
                </Typography>
                <Typography level="body-sm">
                  {" "}
                  <strong>Código:</strong> {courseCode}
                </Typography>
                <Typography level="body-sm">
                  <strong>Docente:</strong> {courseInfo.teacher.name}{" "}
                  {courseInfo.teacher.last_name}
                </Typography>
              </Stack>
              <CourseActions course={courseInfo} />
            </Stack>
            <StudentTable admin course={courseInfo.code} />
          </Fragment>
        ) : (
          <Fragment>
            <Stack
              className="course-details-header"
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <Stack className="course-details-info">
                <Skeleton
                  variant="text"
                  level="h3"
                  animation="wave"
                  loading
                  width={400}
                  // height={40}
                />
                <Skeleton
                  variant="text"
                  level="body-sm"
                  animation="wave"
                  loading
                  width={100}
                />
                <Skeleton
                  variant="text"
                  level="body-sm"
                  animation="wave"
                  loading
                  width={200}
                />
              </Stack>
              <Stack
                className="course-details-button-group"
                direction="row"
                gap={2}
              >
                <Button
                  startDecorator={<ArchiveRoundedIcon />}
                  variant="soft"
                  color="danger"
                >
                  Deshabilitar
                </Button>
                <Button
                  startDecorator={<EditRoundedIcon />}
                  variant="soft"
                  color="neutral"
                >
                  Editar
                </Button>
                <Button
                  onClick={() => navigate(-1)}
                  startDecorator={<CloseRoundedIcon />}
                >
                  Cerrar
                </Button>
              </Stack>
            </Stack>
            <Skeleton
              variant="rectangular"
              animation="wave"
              width="100%"
              height="100%"
              loading
            />
          </Fragment>
        )}
      </Card>
    </>
  );
}
