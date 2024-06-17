import { useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import api from "../../api";
import eventDispacher from "../../utils/eventDispacher";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Tooltip from "@mui/joy/Tooltip";
import Stack from "@mui/joy/Stack";
import Skeleton from "@mui/joy/Skeleton";

export default function RubricResult() {
  const userData = useOutletContext();
  const evalId = useParams().evalId;
  const [fetching, setFetching] = useState(true);
  const [rows, setRows] = useState([]);
  const [scale, setScale] = useState([]);
  const navigate = useNavigate();

  useMemo(() => {
    const fetchEvaluation = async () => {
      api
        .get("api/evaluation_results/", {
          params: {
            student_code: userData.code,
            evaluation_id: evalId,
          },
        })
        .then((response) => {
          console.log(response.data);
          // setRows(response.data.criteria);
          // setScale(response.data.scale);
          setFetching(false);
        })
        .catch((error) => {
          // console.error(error);
          navigate(-1);
          eventDispacher("responseEvent", error, "danger");
        });
    };
    fetchEvaluation();
  }, [userData.code, evalId]);

  return (
    <>
      <Box
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
        <Typography level="h2" component="h1">
          Resultado disponible
        </Typography>
      </Box>
      <Sheet
        className="TableContainer"
        variant="outlined"
        sx={{
          borderRadius: "sm",
          boxShadow: "xs",
          overflow: "auto",
          height: "100%",
        }}
      >
        <Table
          borderAxis="bothBetween"
          aria-labelledby="Tabla de criterios de la evaluación"
          stickyHeader
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "0px",
            "--TableHeader-paddingY": "12px",
            "--TableCell-paddingX": "16px",
            "& thead th": {
              paddingY: "12px",
              paddingX: "16px",
              textAlign: "center",
            },
            "& thead th:nth-of-type(1)": { width: "65%" },

            "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
            "& td ": {
              textAlign: "center", // Centra el contenido horizontalmente
              verticalAlign: "middle", // Centra el contenido verticalmente
            },
            "& td:first-of-type": {
              textAlign: "start", // Centra el contenido horizontalmente
            },
          }}
        >
          <thead>
            {!fetching ? (
              <>
                <tr>
                  <th rowSpan={2}>Criterio</th>
                  <th colSpan={scale.length} style={{ textAlign: "center" }}>
                    Calificación
                  </th>
                </tr>
                <tr>
                  {scale.map((_, index) => (
                    <th key={index}>{index + 1}</th>
                  ))}
                </tr>
              </>
            ) : (
              <>
                <tr>
                  <th>
                    <Skeleton
                      animation="wave"
                      loading
                      level="body-sm"
                      variant="text"
                      width="100%"
                      height="1em"
                    />
                  </th>
                  <th>
                    <Skeleton
                      animation="wave"
                      loading
                      level="body-sm"
                      variant="text"
                      width="100%"
                      height="1em"
                    />
                  </th>
                </tr>
              </>
            )}
          </thead>
          <tbody>
            {!fetching
              ? rows.map((row, rowIndex) => (
                  <Tooltip
                    // title={row.scale_description}
                    key={rowIndex}
                    placement="top-start"
                    variant="outlined"
                    title={
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          maxWidth: 600,
                          justifyContent: "center",
                          p: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            width: "100%",
                            mt: 1,
                          }}
                        >
                          {/* <AdjustIcon color="success" /> */}
                          <div>
                            {/* <Typography fontWeight="lg" fontSize="sm">
          [system] grey is no more recognized as color with the sx prop
        </Typography> */}
                            <Typography
                              textColor="text.secondary"
                              fontSize="sm"
                              sx={{ mb: 1 }}
                            >
                              {row.scale_description}
                            </Typography>
                          </div>
                        </Box>
                      </Box>
                    }
                  >
                    <tr>
                      <td>
                        {/* <IconButton size="sm">
                      <HelpOutlineRoundedIcon />
                    </IconButton> */}
                        <Typography level="body-sm">
                          {row.description}
                        </Typography>
                      </td>
                      {scale.map((_, colIndex) => (
                        <td
                          key={colIndex}
                          style={{
                            padding: "8px",
                            margin: "8px",
                          }}
                        >
                          5
                        </td>
                      ))}
                    </tr>
                  </Tooltip>
                ))
              : Array.from({ length: 4 }, (_, index) => (
                  <tr key={index}>
                    <td>
                      <Stack
                        sx={{
                          width: "100%",
                          height: "5em",
                          padding: "16px",
                        }}
                        direction="column"
                        gap={1}
                        justifyContent="baseline"
                      >
                        <Skeleton
                          animation="wave"
                          loading
                          level="body-sm"
                          variant="text"
                          width="100%"
                          height="1em"
                        />
                        <Skeleton
                          animation="wave"
                          loading
                          level="body-sm"
                          variant="text"
                          width="80%"
                          height="1em"
                        />
                      </Stack>
                    </td>
                    <td>
                      <Stack
                        sx={{
                          width: "100%",
                          height: "5em",
                          padding: "16px",
                        }}
                        direction="column"
                        gap={1}
                        justifyContent="baseline"
                      >
                        <Skeleton
                          animation="wave"
                          loading
                          level="body-sm"
                          variant="text"
                          width="100%"
                          height="1em"
                        />
                        <Skeleton
                          animation="wave"
                          loading
                          level="body-sm"
                          variant="text"
                          width="80%"
                          height="1em"
                        />
                      </Stack>
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>
      </Sheet>
    </>
  );
}
