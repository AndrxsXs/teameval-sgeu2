/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Button from "@mui/joy/Button";
import Skeleton from "@mui/joy/Skeleton";
import Typography from "@mui/joy/Typography";
import Radio from "@mui/joy/Radio";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Textarea from "@mui/joy/Textarea";

import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
// import IconButton from "@mui/joy/IconButton";
import Tooltip from "@mui/joy/Tooltip";

// import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

import api from "../../../api";
import eventDispatcher from "../../../utils/eventDispacher";

export default function Evaluate({ evaluationData }) {
  const evalData = evaluationData;
  const userData = useOutletContext();
  const curso = useParams().curso;
  const [data, setData] = useState();
  const [scale, setScale] = useState();
  const [rows, setRows] = useState();

  // console.log(data);

  //   const data = evaluationData;
  //   const scale = data.rubric.scale;
  //   const rows = data.rubric.standards;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [compañeros, setCompañeros] = useState([]);
  //   const [selectedValues, setSelectedValues] = useState(rows.map(() => null));
  const [selectedValues, setSelectedValues] = useState();
  const [selectedCriteria, setSelectedCriteria] = useState({});
  //   console.log(selectedValues);

  const [formData, setFormData] = useState({});

  // console.log(selectedCriteria);

  const navigate = useNavigate();
  // console.log(evaluationData);

  const fetchPartners = useCallback(async () => {
    await api
      .get(`api/group_members`, {
        params: {
          student_code: userData.code,
          course_code: curso,
          evaluation_id: evalData.id,
        },
      })
      .then((response) => {
        setCompañeros(response.data);
        // console.log(response.data)
        setFetching(false);
        if (response.data.length < 1) {
          navigate("/estudiante");
          eventDispatcher(
            "responseEvent",
            "No hay más compañeros para evaluar, espere a que su docente publique los resultados."
          );
        }
      })
      .catch((error) => {
        navigate(-1);
        eventDispatcher("responseEvent", error);
        setFetching(false);
      });
  }, [userData.code, curso, setCompañeros, setFetching]);

  useEffect(() => {
    const fetchEvaluationInfo = async () => {
      await api
        .get(`api/rubric_evaluate`, {
          params: {
            course_code: curso,
          },
        })
        .then((response) => {
          const data = response.data.data;
          setData(data);
          setScale(data.rubric.scale);
          setRows(data.rubric.standards);
          setSelectedValues(data.rubric.standards.map(() => null));
          setLoadingData(false);
          // console.log(response.data.data);
        })
        .catch((error) => {
          navigate(-1);
          eventDispatcher("responseEvent", error);
          setLoadingData(false);
        });
    };

    fetchPartners();
    fetchEvaluationInfo();

    // window.addEventListener("user-evaluated", fetchPartners);

    // return () => {
    //   window.removeEventListener("user-evaluated", fetchPartners);
    // };
  }, [curso, userData.code, fetchPartners]);

  useEffect(() => {
    window.addEventListener("user-evaluated", fetchPartners);

    return () => {
      window.removeEventListener("user-evaluated", fetchPartners);
    };
  }, [fetchPartners]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const data = { ...formData, ...selectedCriteria };
    console.log(data);
    await api
      .post(`api/evaluate_student/`, {
        ...data,
        id_evaluation: evalData.id,
        evaluator: userData.code,
      })
      .then((response) => {
        window.dispatchEvent(new Event("user-evaluated"));
        eventDispatcher("responseEvent", response);
        setFormData({});
        setSelectedCriteria({}); // Resetear selectedCriteria
        setSelectedValues(rows.map(() => null)); // Resetear selectedValues
        setLoading(false);
      })
      .catch((error) => {
        eventDispatcher("responseEvent", error, "danger");
      });
    setLoading(false);
  };

  // useMemo(() => {
  //   if (compañeros.length < 1) {
  //     navigate(-1);
  //     eventDispatcher(
  //       "responseEvent",
  //       "No hay más compañeros para evaluar, espere a que su docente publique los resultados."
  //     );
  //   }
  // }, [compañeros, navigate]);

  return (
    <Stack direction="column" gap={2}>
      <Stack
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
        <Stack
          direction="column"
          sx={{
            maxWidth: "60%",
          }}
        >
          {!loadingData ? (
            <>
              <Typography level="h2" component="h1">
                {data.name}
              </Typography>

              <Typography level="body-md">
                {data.course.name} - {data.course.code}
              </Typography>
            </>
          ) : (
            <>
              <Skeleton
                variant="text"
                level="h1"
                animation="wave"
                loading
                width={400}
                height={40}
              />
              <Skeleton
                variant="text"
                level="body-md"
                animation="wave"
                loading
                width={300}
                height="1.5em"
              />
            </>
          )}
        </Stack>
      </Stack>
      {!fetching ? (
        <>
          <Select
            required
            sx={{
              width: "30%",
            }}
            size="sm"
            placeholder="Seleccione un compañero"
            onChange={(e, value) =>
              setFormData({ ...formData, evaluated: value })
            }
          >
            {compañeros.map((compa) => (
              <Option key={compa.code} value={compa.code}>
                {compa.name} {compa.last_name}
              </Option>
            ))}
          </Select>
        </>
      ) : (
        <Skeleton
          animation="wave"
          loading
          level="h2"
          variant="text"
          width="30%"
          //   height="1em"
        />
      )}
      <form
        onSubmit={handleSubmit}
        style={{
          height: "calc(100vh - 250px)",
        }}
      >
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
                {!loadingData ? (
                  <>
                    <tr>
                      <th rowSpan={2}>Criterio</th>
                      <th
                        colSpan={scale.length}
                        style={{ textAlign: "center" }}
                      >
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
                {!loadingData
                  ? rows.map((row, rowIndex) =>
                      row.scale_description ? (
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
                                    {row.scale_description || "Sin descripción"}
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
                                <Radio
                                  required
                                  name={`row-${rowIndex}`}
                                  value={colIndex + 1}
                                  checked={
                                    selectedValues[rowIndex] == colIndex + 1
                                  }
                                  onChange={(e) => {
                                    const newValues = [...selectedValues];
                                    newValues[rowIndex] = e.target.value;
                                    setSelectedValues(newValues);
                                    setSelectedCriteria({
                                      ...selectedCriteria,
                                      [rowIndex + 1]: e.target.value,
                                    });
                                  }}
                                  size="lg"
                                />
                              </td>
                            ))}
                          </tr>
                        </Tooltip>
                      ) : (
                        <tr key={row}>
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
                              <Radio
                                required
                                name={`row-${rowIndex}`}
                                value={colIndex + 1}
                                checked={
                                  selectedValues[rowIndex] == colIndex + 1
                                }
                                onChange={(e) => {
                                  const newValues = [...selectedValues];
                                  newValues[rowIndex] = e.target.value;
                                  setSelectedValues(newValues);
                                  setSelectedCriteria({
                                    ...selectedCriteria,
                                    [rowIndex + 1]: e.target.value,
                                  });
                                }}
                                size="lg"
                              />
                            </td>
                          ))}
                        </tr>
                      )
                    )
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
          <Stack
            direction="row"
            sx={{
              alignItems: "flex-end",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "100%",
              }}
            >
              <FormControl>
                <FormLabel level="body-sm">Comentarios (Opcional):</FormLabel>
                <Textarea
                  minRows={2}
                  maxRows={3}
                  placeholder="Escriba aquí sus comentarios"
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                />
              </FormControl>
            </Box>
            <Stack
              justifyContent="end"
              width="100%"
              direction="row-reverse"
              alignItems="baseline"
              gap={2}
            >
              <Button
                loading={loading}
                sx={{
                  marginTop: "16px",
                }}
                type="submit"
              >
                Calificar
              </Button>
              <Button
                color="neutral"
                variant="outlined"
                onClick={() => navigate(-1)}
              >
                Regresar
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
}
