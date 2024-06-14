/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  useNavigate,
  redirect,
  useOutletContext,
  useParams,
} from "react-router-dom";

import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Button from "@mui/joy/Button";
import Skeleton from "@mui/joy/Skeleton";
import Typography from "@mui/joy/Typography";
import Radio from "@mui/joy/Radio";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import IconButton from "@mui/joy/IconButton";

import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

import api from "../../../api";
import eventDispatcher from "../../../utils/eventDispacher";

export default function Evaluate({ evaluationData }) {
  const userData = useOutletContext();
  //   const curso = useParams().curso;

  //   console.log(curso);

  const data = evaluationData;
  const scale = data.rubric.scale;
  const rows = data.rubric.standards;
  const [loading, setLoading] = useState(false);
  const [compañeros, setCompañeros] = useState([]);
  const [selectedValues, setSelectedValues] = useState(rows.map(() => null));
  const [selectedCriteria, setSelectedCriteria] = useState({});
  //   console.log(selectedValues);

  const [formData, setFormData] = useState({
    id_evaluation: data.id,
    evaluator: userData.code,
  });

  console.log(selectedCriteria);

  const navigate = useNavigate();
  //   console.log(data);

  useEffect(() => {
    if (!evaluationData) {
      console.log("No evaluation data");
      redirect("/estudiante/");
    }

    const fetchPartners = async () => {
      setLoading(true);
      await api
        .get(`api/group_members`, {
          params: {
            student_code: userData.code,
            course_code: data.course.code,
          },
        })
        .then((response) => {
          setCompañeros(response.data);
          setLoading(false);
        })
        .catch((error) => {
          eventDispatcher("responseEvent", error);
          setLoading(false);
        });
    };
    fetchPartners();

    window.addEventListener("user-evaluated", fetchPartners());

    return () => {
      window.removeEventListener("user-evaluated", fetchPartners());
    };
  }, [evaluationData, userData.code, data.course.code]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const data = { ...formData, ...selectedCriteria };
    await api
      .post(`api/evaluate_student/`, data)
      .then((response) => {
        window.dispatchEvent(new Event("user-evaluated"));
        eventDispatcher("responseEvent", response);
        setFormData({
          id_evaluation: data.id,
          evaluator: userData.code,
        });
        setSelectedCriteria({}); // Resetear selectedCriteria
        setSelectedValues(rows.map(() => null)); // Resetear selectedValues
        setLoading(false);
      })
      .catch((error) => {
        eventDispatcher("responseEvent", error, "danger");
      });
    setLoading(false);
  };

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
          <Typography level="h2" component="h1">
            {data.name}
          </Typography>
          <Typography level="body-md">
            {data.course.name} - {data.course.code}
          </Typography>
        </Stack>
        <Button onClick={() => navigate(-1)}>Regresar</Button>
      </Stack>
      <Select
        required
        sx={{
          width: "30%",
        }}
        size="sm"
        placeholder="Seleccione un compañero"
        onChange={(e, value) => setFormData({ ...formData, evaluated: value })}
      >
        {compañeros.map((compa) => (
          <Option key={compa.code} value={compa.code}>
            {compa.name} {compa.last_name}
          </Option>
        ))}
      </Select>
      <form onSubmit={handleSubmit}>
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
              },
              "& thead th:nth-of-type(1)": { width: "80%" },

              "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
            }}
          >
            <thead>
              <tr>
                <th rowSpan={2}>Criterio</th>
                <th
                  colSpan={data.rubric.scale.length}
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
            </thead>
            <tbody>
              {
                !loading
                  ? rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td>
                          <IconButton size="sm">
                            <HelpOutlineRoundedIcon />
                          </IconButton>
                          {row.description}
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
                              name={`row-${rowIndex}`}
                              value={colIndex + 1}
                              checked={selectedValues[rowIndex] == colIndex + 1}
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
                    ))
                  : null
                // Array.from({ length: 7 }, (_, index) => (
                //     <tr key={index}>
                //       <td>
                //         <Stack
                //           sx={{
                //             width: "100%",
                //             height: "5em",
                //             padding: "16px",
                //           }}
                //           direction="column"
                //           gap={1}
                //           justifyContent="baseline"
                //         >
                //           <Skeleton
                //             animation="wave"
                //             loading
                //             level="body-sm"
                //             variant="text"
                //             width="100%"
                //             height="1em"
                //           />
                //           <Skeleton
                //             animation="wave"
                //             loading
                //             level="body-sm"
                //             variant="text"
                //             width="80%"
                //             height="1em"
                //           />
                //         </Stack>
                //       </td>
                //       <td>
                //         <Stack
                //           sx={{
                //             width: "100%",
                //             height: "5em",
                //             padding: "16px",
                //           }}
                //           direction="column"
                //           gap={1}
                //           justifyContent="baseline"
                //         >
                //           <Skeleton
                //             animation="wave"
                //             loading
                //             level="body-sm"
                //             variant="text"
                //             width="100%"
                //             height="1em"
                //           />
                //           <Skeleton
                //             animation="wave"
                //             loading
                //             level="body-sm"
                //             variant="text"
                //             width="80%"
                //             height="1em"
                //           />
                //         </Stack>
                //       </td>
                //     </tr>
                //   ))
              }
            </tbody>
          </Table>
        </Sheet>
        <Stack justifyContent="end" width="100%" direction="row">
          <Button
            loading={loading}
            sx={{
              marginTop: "16px",
            }}
            type="submit"
          >
            Calificar
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
