/* eslint-disable react/prop-types */
import { useState, Fragment, useMemo } from "react";
import { useOutletContext, useParams, Link } from "react-router-dom";

import api from "../../../api";
import eventDispatcher from "../../../utils/eventDispacher";
import interpretEvaluationState from "../../../utils/interpretEvaluationState";

import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemButton from "@mui/joy/ListItemButton";
import Chip from "@mui/joy/Chip";
import Skeleton from "@mui/joy/Skeleton";

export default function ViewEvaluations() {
  const courseId = useParams().courseId;
  const userData = useOutletContext();
  const [courseData, setCourseData] = useState({});
  const [evaluations, setEvaluations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);

  useMemo(() => {
    const fetchCourseData = async () => {
      await api
        .get(`api/course_info/${courseId}/`)
        .then((response) => {
          setCourseData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          eventDispatcher("responseEvent", error, "danger");
          setLoading(false);
        });
    };
    fetchCourseData();
  }, [courseId]);

  useMemo(() => {
    const fetchEvaluations = async () => {
      await api
        .get("api/completed_evaluations", {
          params: {
            course_code: courseId,
            student_code: userData.code,
          },
        })
        .then((response) => {
          setEvaluations(response.data);
          setFetching(false);
        })
        .catch((error) => {
          console.error(error);
          eventDispatcher("responseEvent", error, "danger");
          setFetching(false);
        });
    };
    fetchEvaluations();
  }, [courseId, userData.code]);

  return (
    <Fragment>
      <Stack
        component="header"
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 2,
          mb: 1,
          gap: 1,
          alignItems: "start",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Typography level="h2">Resultados disponibles</Typography>
        {!loading ? (
          <>
            <Typography level="h4">
              Curso: {courseData.name} - {courseData.code}
            </Typography>
            <Typography level="body-md">
              {courseData.teacher.name.concat(
                " ",
                courseData.teacher.last_name
              )}
            </Typography>
            <Typography level="body-sm">
              {courseData.academic_period}
            </Typography>
          </>
        ) : (
          <>
            <Skeleton animation="wave" variant="text" level="h4" width={400} />
            <Skeleton
              animation="wave"
              variant="text"
              level="body-md"
              width={300}
            />
            <Skeleton
              animation="wave"
              variant="text"
              level="body-sm"
              width={100}
            />
          </>
        )}
      </Stack>
      <Box sx={{ height: "var(--ListDivider-gap)" }} />
      {!loading ? (
        <>
          <Typography level="body-md">
            Resultados de evaluaciones completadas en el curso {courseData.name}
            , seleccione una para ver los resultados.
          </Typography>
        </>
      ) : (
        <>
          <Skeleton
            animation="wave"
            level="body-md"
            variant="text"
            width="100%"
          />
        </>
      )}
      <Card variant="outlined" sx={{ width: "100%", p: 0 }}>
        <List
          sx={{
            py: "var(--ListDivider-gap)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!fetching
            ? evaluations.map((item, index) => (
                <Fragment key={item.title}>
                  <ListItem>
                    <Link
                      to={`./${item.id}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        backgroundColor: "inherit",
                        borderRadius: "inherit",
                        width: "100%",
                      }}
                    >
                      <ListItemButton sx={{ gap: 2 }}>
                        <ListItemContent
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography level="title-md">
                              {item.name}
                            </Typography>
                            <Chip
                              color={item.estado == 3 ? "success" : "primary"}
                            >
                              {interpretEvaluationState(item.estado)}
                            </Chip>
                          </Box>
                        </ListItemContent>
                      </ListItemButton>
                    </Link>
                  </ListItem>
                  {index !== evaluations.length - 1 && <ListDivider />}
                </Fragment>
              ))
            : Array.from({ length: 6 }, (_, index) => (
                <>
                  <ListItem key={index}>
                    <ListItemButton sx={{ gap: 2 }}>
                      <ListItemContent>
                        <Skeleton
                          animation="wave"
                          variant="text"
                          level="title-md"
                          width={500}
                        />
                        <Skeleton
                          animation="wave"
                          variant="text"
                          level="body-md"
                          width={100}
                        />
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                  {<ListDivider />}
                </>
              ))}
        </List>
      </Card>
    </Fragment>
  );
}
