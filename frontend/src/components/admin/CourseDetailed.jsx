/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import StudentTable from "../teacher/StudentTable";
import ManageCourse from "../admin/ManageCourse";
import DisableCourse from "./DisableCourse";
import EnableCourse from "./EnableCourse";
import ImportUsersModal from "../teacher/ImportUsersModal";
import CreateStudent from "../teacher/CreateStudent";
import GroupsTable from "../teacher/groups/GroupsTable";
import CreateGroup from "../teacher/groups/CreateGroup";
import RubricList from "../teacher/RubricList";
import CreateRubric from "../teacher/CreateRubric";
import EvaluationList from "../teacher/EvaluationList";

import Card from "@mui/joy/Card";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Skeleton from "@mui/joy/Skeleton";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import api from "../../api";
import eventDispatcher from "../../utils/eventDispacher";
import CreateEvaluation from "../teacher/CreateEvaluation";

function CourseActions(props) {
  const { course } = props;
  const navigate = useNavigate();

  return (
    <Stack className="course-details-button-group" direction="row" gap={1}>
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
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [courseInfo, setCourseInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseInfo = async () => {
      await api
        .get(`api/course_info/${courseId}/`)
        .then((response) => {
          setCourseInfo(response.data);
          // console.log(response.data);
          setLoading(false);
        })
        .catch((error) => {
          eventDispatcher("responseEvent", error, "danger");
          setLoading(false);
        });
    };
    fetchCourseInfo();

    window.addEventListener("course-updated", fetchCourseInfo);
    window.addEventListener("course-enabled", fetchCourseInfo);
    window.addEventListener("course-disabled", fetchCourseInfo);

    return () => {
      window.removeEventListener("course-updated", fetchCourseInfo);
      window.removeEventListener("course-enabled", fetchCourseInfo);
      window.removeEventListener("course-disabled", fetchCourseInfo);
    };
  }, [courseId]);

  return (
    <>
      <Card
        sx={{
          p: 2,
          width: "clamp(100%, 100%, 1000px)",
          height: "100%",
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
                  {courseInfo.name} - {courseId}
                </Typography>
                <Typography level="body-sm">
                  <strong>Docente:</strong> {courseInfo.teacher.name}{" "}
                  {courseInfo.teacher.last_name}
                </Typography>
                <Typography level="body-xs">
                  Periodo {courseInfo.academic_period}
                </Typography>
              </Stack>
              <CourseActions course={courseInfo} />
            </Stack>
            <Stack
              className="course-details-body"
              sx={{
                height: "100%",
              }}
            >
              <Tabs
                variant="plain"
                aria-label="Contenedor principal"
                defaultValue={0}
                sx={{
                  // width: 343,
                  borderRadius: "lg",
                  // boxShadow: "sm",
                  // "&:hover": {
                  //   boxShadow: "none",
                  // },
                  // transition: "box-shadow 0.3s",
                  // overflow: "clip",
                  height: "100%",
                  width: "100%",
                  gap: 1,
                  py: 0,
                  // overflow: "auto",
                }}
              >
                <TabList
                  variant="outlined"
                  size="sm"
                  sticky="top"
                  tabFlex={1}
                  // sx={{
                  //   [`& .${tabClasses.root}`]: {
                  //     fontSize: "sm",
                  //     fontWeight: "lg",
                  //     [`&[aria-selected="true"]`]: {
                  //       color: "primary.500",
                  //       bgcolor: "background.surface",
                  //     },
                  //     [`&.${tabClasses.focusVisible}`]: {
                  //       outlineOffset: "-4px",
                  //     },
                  //   },
                  //   zIndex: 11,
                  // }}
                  sx={{
                    width: "85%",
                    alignSelf: "center",
                    p: 0.5,
                    gap: 1,
                    borderRadius: "lg",
                    bgcolor: "background.level1",
                    [`& .${tabClasses.root}`]: {
                      fontWeight: "md",
                    },
                    [`& .${tabClasses.root}[aria-selected="true"]`]: {
                      color: "primary.500",
                      boxShadow: "sm",
                      bgcolor: "background.surface",
                      fontWeight: "lg",
                    },
                    boxShadow: "md",
                    "&:hover": {
                      boxShadow: "sm",
                    },
                    transition: "box-shadow 0.3s",
                    zIndex: 11,
                    // paddingBottom: 0,
                  }}
                >
                  <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
                    Estudiantes
                  </Tab>
                  <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
                    Grupos
                  </Tab>
                  <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
                    Rúbricas
                  </Tab>
                  <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
                    Evaluaciones
                  </Tab>
                  <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
                    Informes
                  </Tab>
                </TabList>
                <TabPanel
                  value={0}
                  sx={{
                    padding: 0,
                    height: "50dvh",
                    overflow: "auto",
                  }}
                >
                  <Stack
                    direction="column"
                    gap={1}
                    sx={{
                      height: "100%",
                    }}
                  >
                    <StudentTable admin course={courseInfo.code} />
                    <Stack direction="row" gap={1}>
                      <ImportUsersModal courseId={courseId} isStudent />
                      <CreateStudent course={courseId} />
                    </Stack>
                  </Stack>
                </TabPanel>
                <TabPanel
                  value={1}
                  sx={{
                    padding: 0,
                    height: "50dvh",
                    overflow: "auto",
                  }}
                >
                  <Stack
                    direction="column"
                    gap={1}
                    sx={{
                      height: "100%",
                    }}
                  >
                    <GroupsTable course={courseInfo.code} />
                    <Stack direction="row">
                      <CreateGroup course={courseInfo.code} />
                    </Stack>
                  </Stack>
                </TabPanel>
                <TabPanel
                  value={2}
                  sx={{
                    padding: 0,
                    height: "50dvh",
                    overflow: "auto",
                  }}
                >
                  <Stack
                    direction="column"
                    gap={1}
                    sx={{
                      height: "100%",
                    }}
                  >
                    <RubricList admin />
                    <Stack direction="row">
                      <CreateRubric />
                    </Stack>
                  </Stack>
                </TabPanel>
                <TabPanel
                  value={3}
                  sx={{
                    padding: 0,
                    height: "50dvh",
                    overflow: "auto",
                  }}
                >
                  <Stack
                    direction="column"
                    gap={1}
                    sx={{
                      height: "100%",
                    }}
                  >
                    <EvaluationList />
                    <Stack direction="row">
                      <CreateEvaluation />
                    </Stack>
                  </Stack>
                </TabPanel>
              </Tabs>
            </Stack>
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
                  width={200}
                />
                <Skeleton
                  variant="text"
                  level="body-sm"
                  animation="wave"
                  loading
                  width={100}
                />
              </Stack>
              <Stack
                className="course-details-button-group"
                direction="row"
                gap={2}
              >
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width={120}
                  height={36}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width={120}
                  height={36}
                />
                <Button
                  variant="soft"
                  onClick={() => navigate(-1)}
                  startDecorator={<CloseRoundedIcon />}
                >
                  Cerrar
                </Button>
              </Stack>
            </Stack>
            <Skeleton
              sx={{
                alignSelf: "center",
                borderRadius: "md",
              }}
              variant="rectangular"
              animation="wave"
              width="85%"
              height={50}
              loading
            />
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
