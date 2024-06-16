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
                  {courseInfo.name} - {courseCode}
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
                    [`& .${tabClasses.root}[aria-selected="true"]`]: {
                      boxShadow: "sm",
                      bgcolor: "background.surface",
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
                      <ImportUsersModal courseId={courseCode} isStudent />
                      <CreateStudent course={courseCode} />
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
                  <Typography level="inherit">
                    The most advanced features for data-rich applications, as
                    well as the highest priority for support.
                  </Typography>
                  <Typography
                    textColor="primary.400"
                    fontSize="xl3"
                    fontWeight="xl"
                    mt={1}
                  >
                    <Typography
                      fontSize="xl"
                      borderRadius="sm"
                      px={0.5}
                      mr={0.5}
                      sx={(theme) => ({
                        ...theme.variants.soft.danger,
                        color: "danger.400",
                        verticalAlign: "text-top",
                        textDecoration: "line-through",
                      })}
                    >
                      $49
                    </Typography>
                    $37*{" "}
                    <Typography
                      fontSize="sm"
                      textColor="text.secondary"
                      fontWeight="md"
                    >
                      / dev / month
                    </Typography>
                  </Typography>
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
