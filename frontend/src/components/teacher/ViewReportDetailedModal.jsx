/* eslint-disable react/prop-types */
import { Fragment, useState, useEffect, useMemo } from "react";

import api from "../../api";
import eventDispatcher from "../../utils/eventDispacher";
import ModalFrame from "../ModalFrame";

import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Box from "@mui/joy/Box";
import CircularProgress from "@mui/joy/CircularProgress";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";

export default function ViewReportDetailedModal({ data, open, setOpen }) {
  const [inputData, setInputData] = useState({});
  const [evaluationData, setEvaluationData] = useState({});
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // console.log(inputData);

  useMemo(() => {
    if (open && Array.isArray(evaluationData)) {
      const tableData = [];

      evaluationData.forEach((group) => {
        const evaluated = group[0].evaluated;
        const evaluator = group[0].evaluator;

        const rowData = { evaluated, evaluator, standards: [] };

        group.forEach((item) => {
          rowData.standards.push({
            standard: item.standard,
            qualification: item.qualification,
          });
        });

        tableData.push(rowData);
      });

      setRows(tableData);
    }
  }, [evaluationData, open]);

  useMemo(() => {
    setInputData(data);
  }, [data]);

  const handleCloseModal = (value) => {
    setOpen(value);
  };

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      await api
        .get(`api/report_datailed/${inputData.id_rubric}`)
        .then((response) => {
          setEvaluationData(response.data);
        })
        .catch((error) => {
          console.error(error);
          eventDispatcher("responseEvent", error, "danger");
          setOpen(false);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchReportData();

    window.addEventListener("load", fetchReportData);

    return () => {
      window.removeEventListener("load", fetchReportData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputData]);

  return (
    <Fragment>
      <ModalFrame
        ModalTitle="Informe detallado de la evaluación"
        open={open}
        onClose={handleCloseModal}
      >
        <Typography level="title-md">
          Informe detallado de la evaluación {inputData.name}
        </Typography>
        <Typography level="body-sm">
          Rúbrica usada: {inputData.rubric}
        </Typography>
        <Sheet
          className="TableContainer"
          variant="outlined"
          sx={{
            display: { xs: "none", sm: "flex" },
            flexFlow: "column",
            alignItems: "center",
            justifyContent: "space-between",
            width: "1000px",
            height: "100%",
            borderRadius: "sm",
            flexShrink: 1,
            minHeight: 0,
            boxShadow: "sm",
            "&:hover": {
              boxShadow: "none",
            },
            transition: "box-shadow 0.3s",
            overflow: "auto",
            background: (theme) =>
              `linear-gradient(to right, ${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
        linear-gradient(to right, rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
        radial-gradient(
          farthest-side at 0 50%,
          rgba(0, 0, 0, 0.12),
          rgba(0, 0, 0, 0)
        ),
        radial-gradient(
            farthest-side at 100% 50%,
            rgba(0, 0, 0, 0.12),
            rgba(0, 0, 0, 0)
          )
          0 100%`,
            backgroundSize:
              "40px calc(100% - var(--TableCell-height)), 40px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height))",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "local, local, scroll, scroll",
            backgroundPosition:
              "var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height), var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height)",
            backgroundColor: "background.surface",
            "--Table-lastColumnWidth": "20%",
          }}
        >
          <Table
            aria-labelledby="Tabla de administradores"
            stickyHeader
            hoverRow
            sx={{
              "--TableCell-headBackground":
                "var(--joy-palette-background-level1)",
              "--Table-headerUnderlineThickness": "1px",
              "--TableRow-hoverBackground":
                "var(--joy-palette-background-level1)",
              "--TableCell-paddingY": "4px",
              "--TableHeader-paddingY": "12px",
              "--TableCell-paddingX": "16px",
              "& thead th": {
                paddingY: "12px",
              },

              "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    width: "20%",
                  }}
                >
                  Estudiante evaluado
                </th>
                <th
                  style={{
                    width: "20%",
                  }}
                >
                  Evaluador
                </th>
                <th>Criterios</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>{row.evaluated}</td>
                  <td>{row.evaluator}</td>
                  <td>
                    <Table
                      aria-labelledby="Tabla de criterios"
                      sx={{
                        "--TableCell-headBackground":
                          "var(--joy-palette-background-level1)",
                        "--TableRow-hoverBackground":
                          "var(--joy-palette-background-level1)",
                        "--TableCell-paddingY": "4px",
                        "--TableHeader-paddingY": "12px",
                        "--TableCell-paddingX": "16px",
                        "& thead th": {
                          paddingY: "12px",
                        },
                        "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
                      }}
                    >
                      <thead>
                        <tr>
                          <th>Criterio</th>
                          <th>Calificación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {row.standards.map((standard, idx) => (
                          <tr key={idx}>
                            <td>{standard.standard}</td>
                            <td>{standard.qualification}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                minHeight: "41px",
                borderTop:
                  rows && rows.length < 1 ? "transparent" : "1px solid",
                borderTopColor: "divider",
              }}
            >
              <CircularProgress size="md" />
              <Typography level="body-xs" sx={{ userSelect: "none" }}>
                <Fragment>Cargando datos...</Fragment>
              </Typography>
            </Box>
          ) : (
            <Typography
              component="span"
              level="body-xs"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                minHeight: "41px",
                borderTop:
                  rows && rows.length < 1 ? "transparent" : "1px solid",
                borderTopColor: "divider",
                userSelect: "none",
              }}
            >
              {rows && rows.length === 0 ? (
                <Fragment>No hay registros</Fragment>
              ) : (
                <Fragment>Nada más por aquí</Fragment>
              )}
            </Typography>
          )}
        </Sheet>
        <Stack
          direction="row"
          gap={2}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: 1,
            gap: 2,
          }}
        >
          <Button onClick={() => setOpen(false)}>Cerrar</Button>
        </Stack>
      </ModalFrame>
    </Fragment>
  );
}
