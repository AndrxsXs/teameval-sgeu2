import { Fragment, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";
import eventDispatcher from "../../../utils/eventDispacher";

import CriteriaTableInfo from "../../../components/CriteriaTableInfo";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/material/Stack";
import Button from "@mui/joy/Button";
// import CreateStudent from "../../../components/teacher/CreateStudent";
// import ImportUsersModal from "../../../components/teacher/ImportUsersModal";

export default function ViewRubric() {
  const rubricId = useParams().rubric;
  const [loading, setLoading] = useState(true);
  const [rubric, setRubric] = useState({});
  const navigate = useNavigate();
  // console.log(rubric)
  useEffect(() => {
    const fetchRubric = async () => {
      await api
        .get(`api/info_rubric/${rubricId}/`)
        .then((response) => {
          setRubric(response.data);
          setLoading(false);
        })
        .catch((error) => {
          eventDispatcher("responseEvent", error);
          setLoading(false);
        });
    };
    fetchRubric();
  }, [rubricId]);

  return (
    <Fragment>
      <Box
        component="header"
        sx={{
          display: "flex",
          mt: 2,
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {!loading ? (
          <>
            <Stack direction="column">
              <Typography level="h2" component="h1">
                {rubric.name}
              </Typography>
              <Typography level="title-md">
                Escala: 1 - {rubric.scale.Upper_limit}
              </Typography>
            </Stack>
          </>
        ) : (
          <Skeleton
            variant="text"
            level="h1"
            animation="wave"
            loading
            width={400}
            height={40}
          />
        )}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button variant="outlined" color="neutral" onClick={() => navigate(-1)}>Volver</Button>
          {/* <CreateStudent course={courseId} />
          <ImportUsersModal courseId={courseId} isStudent /> */}
        </Box>
      </Box>
      <CriteriaTableInfo />
    </Fragment>
  );
}
