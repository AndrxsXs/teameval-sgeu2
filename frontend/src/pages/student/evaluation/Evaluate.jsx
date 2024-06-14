/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate, redirect, useOutletContext } from "react-router-dom";

import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Button from "@mui/joy/Button";
import Skeleton from "@mui/joy/Skeleton";
import Typography from "@mui/joy/Typography";
import Checkbox from "@mui/joy/Checkbox";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import IconButton from "@mui/joy/IconButton";

import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

import api from "../../../api";
import eventDispatcher from "../../../utils/eventDispacher";

export default function Evaluate({ evaluationData }) {
  const userData = useOutletContext();
  //   console.log(userData);
  const data = evaluationData;
  const scale = data.rubric.scale;
  const rows = data.rubric.standards;
  const [loading, setLoading] = useState(false);
  const [compañeros, setCompañeros] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState({});

  //   console.log(compañeros);

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
  }, [evaluationData, userData.code, data.course.code]);

  const handleSubmit = async () => {
    console.log("submitting evaluation");
  };

  return (
    <>
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
        sx={{
          width: "30%",
        }}
        size="sm"
        placeholder="Seleccione un compañero"
        onChange={(e, value) => setSelectedPartner(value)}
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
            height: "calc(100vh - 150px)",
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
              {!loading
                ? rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>
                        <IconButton
                          size="sm"
                          //   sx={{
                          //     "--IconButton-size": "24px",
                          //   }}
                        >
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
                          <Checkbox size="lg" />
                        </td>
                      ))}
                    </tr>
                  ))
                : Array.from({ length: 7 }, (_, index) => (
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
      </form>
    </>
  );
}
