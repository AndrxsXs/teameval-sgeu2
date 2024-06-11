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
  // console.log(rubric);
  return (
    <Link
      // to={`./rubric/${rubric.id}`}
    to="#"
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Card
        sx={{
          width: 300,
          height: 150,
          borderRadius: "sm",
          boxShadow: "sm",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 2,
          transition: "box-shadow 0.3s",
          "&:hover": {
            boxShadow: "none",
          },
          overflow: "hidden",
        }}
      >
        <CardContent>
          <Typography level="title-md">{rubric.name}</Typography>
          <Typography level="body-xs" color="textSecondary">
            Escala: 1 - {rubric.scale.length}
          </Typography>
          <Typography level="body-xs" color="textSecondary">
            {rubric.standards.length}{" "}
            {rubric.standards.length === 1 ? "criterio:" : "criterios:"}
          </Typography>
          <Typography>
            {rubric.standards.map((standard, index) => (
              <Typography
                key={index}
                level="body-xs"
                color="textSecondary"
              >
                {standard.description}
              </Typography>
            ))}
          </Typography>
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
          justifyContent: "flex-start",
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
