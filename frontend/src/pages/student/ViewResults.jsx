import { useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import api from "../../api";
import eventDispacher from "../../utils/eventDispacher";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Tooltip from "@mui/joy/Tooltip";
import Stack from "@mui/joy/Stack";
import Skeleton from "@mui/joy/Skeleton";
import Avatar from "@mui/joy/Avatar";

export default function ViewResults() {
  const userData = useOutletContext();
  const evalId = useParams().evalId;
  const [fetching, setFetching] = useState(true);
  const [rows, setRows] = useState([]);
  const [scale, setScale] = useState([]);
  const [comments, setComments] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
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
          // console.log(response.data);
          const { final_score, standards, comments, partners } = response.data;
          const scale = Array.from(
            { length: partners },
            (_, index) => index + 1
          );
          const rows = standards.map((standard) => ({
            description: standard.standard_description,
            scale_description: standard.standard_description,
            individual_ratings: standard.individual_ratings,
          }));
          setRows(rows);
          setScale(scale);
          setFetching(false);
          setComments((prevComments) => [...prevComments, comments]);
          setFinalScore(final_score);
        })
        .catch((error) => {
          navigate(-1);
          eventDispacher("responseEvent", error, "danger");
        });
    };

    fetchEvaluation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.code, evalId]);

  return (
    <>
      <Box
        component="header"
        sx={{
          display: "flex",
          flexDirection: "row",
          mt: 2,
          mb: 1,
          gap: 1,
          alignItems: "start",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
          // overflow: "hidden",
        }}
      >
        <Typography level="h2" component="h1">
          Resultado disponible
        </Typography>
        <Button
          variant="outlined"
          color="neutral"
          onClick={() => {
            navigate(-1);
          }}
        >
          Volver
        </Button>
      </Box>
      <Stack
        direction="column"
        gap={2}
        sx={{
          height: "100%",
          maxHeight: "600px",
          display: "flex",
          overflow: "auto",
          justifyContent: "space-between",
        }}
      >
        <Sheet
          className="TableContainer"
          variant="outlined"
          sx={{
            borderRadius: "sm",
            boxShadow: "xs",
            overflow: "auto",
            // height: "100%",
            maxHeight: "600px",
          }}
        >
          <Table
            borderAxis="bothBetween"
            aria-labelledby="Tabla de criterios de la evaluación"
            stickyHeader
            sx={{
              // height: "100%",
              "& tr": {
                height: "40px",
              },
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
              "& thead th:nth-of-type(1)": { width: "60%" },

              "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
              "& td:first-of-type, th:first-of-type": {
                textAlign: "start", // Centra el contenido horizontalmente
              },
              "& td, th": {
                textAlign: "center", // Centra el contenido horizontalmente
                verticalAlign: "middle", // Centra el contenido verticalmente
              },
              captionSide: "bottom",
            }}
          >
            {/* <caption>
            <Typography level="body-md" fontWeight="bold">
              Calificación total: {finalScore}
            </Typography>
          </caption> */}
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
                      <Tooltip
                        variant="outlined"
                        placement="top-start"
                        key={index}
                        title={`Compañero anónimo`}
                      >
                        <th>
                          <Stack
                            sx={{
                              display: "flex",
                              width: "100%",
                              height: "100%",
                              justifyContent: "center",
                              alignItems: "center",
                              p: 0,
                              m: 0,
                            }}
                          >
                            <Avatar
                              className="compa"
                              size="sm"
                              variant="outlined"
                              alt={`Compañero anónimo`}
                            >
                              C
                            </Avatar>
                          </Stack>
                        </th>
                      </Tooltip>
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
                          <Typography level="body-sm">
                            {row.description}
                          </Typography>
                        </td>
                        {scale.map((_, colIndex) => (
                          <td key={colIndex}>
                            {row.individual_ratings[colIndex] || "-"}
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
            {!fetching && (
              <tfoot>
                <tr>
                  <td>
                    <Typography level="body-sm" fontWeight="bold">
                      Calificación final:
                    </Typography>
                  </td>
                  <td colSpan={scale.length}>
                    <Typography level="body-sm" fontWeight="bold">
                      {finalScore}
                    </Typography>
                  </td>
                </tr>
              </tfoot>
            )}
          </Table>
        </Sheet>
        {!fetching && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "100%",
            }}
          >
            <Typography level="body-sm">Comentarios:</Typography>
            <Sheet
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: "sm",
                width: "100%",
                minHeight: "150px",
                overflow: "auto",
              }}
            >
              <Typography
                level="body-md"
                sx={{
                  userSelect: "none",
                }}
              >
                {comments.length > 0 ? (
                  <ul>
                    {comments.map((comment) => {
                      const id = crypto.randomUUID();
                      return <li key={id}>{comment}</li>;
                    })}
                  </ul>
                ) : (
                  "No hay comentarios"
                )}
              </Typography>
            </Sheet>
          </Box>
        )}
      </Stack>
    </>
  );
}
