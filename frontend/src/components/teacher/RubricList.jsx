/* eslint-disable react/prop-types */
import { Fragment, useState, useEffect } from "react";

import api from "../../api";

import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";

import { Link, useParams } from "react-router-dom";

function RubricCard({ rubric }) {
  return (
    <Link to={`/rubric/${rubric.id}`}>
      <Card>
        <CardContent>
          <Typography>{rubric.name}</Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function RubricList() {
  const { courseId } = useParams();

  const [rubrics, setRubrics] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRubrics = async () => {
      setLoading(true);
      const token = localStorage.getItem("ACCESS_TOKEN");
      await api
        .get(`api/list_rubric/${courseId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setRubrics(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchRubrics();
  }, [courseId]);

  return (
    <Fragment>
      <Box
        component="section"
        width="100%"
        height="100%"
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 2,
          overflow: "auto",
          justifyContent: "center",
          alignContent: "start",
        }}
      >
        {!loading
          ? rubrics.map((rubric) => (
              <RubricCard key={rubric.id} rubric={rubric} />
            ))
          : Array.from(new Array(9)).map((_, index) => (
              <Skeleton
                key={index}
                animation="wave"
                variant="rectangular"
                width={300}
                height={150}
                loading
                sx={{ borderRadius: "sm" }}
              />
            ))}
        {rubrics.length === 0 && !loading && (
          <Stack direction={{ xs: "column", sm: "row" }} width="100%">
            <Typography level="body-sm" component="p">
              No hay rúbricas disponibles, cree una nueva usando el botón{" "}
              <Typography level="title-sm" color="primary">
                Nueva rúbrica
              </Typography>
              .
            </Typography>
          </Stack>
        )}
      </Box>
    </Fragment>
  );
}
