/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from "react";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Textarea from "@mui/joy/Textarea";
import { useParams } from "react-router-dom";
import api from "../api";
import eventDispatcher from "../utils/eventDispacher";
import Stack from "@mui/joy/Stack";

import Skeleton from "@mui/joy/Skeleton";

export default function CriteriaTableInfo(props) {
  const { onStandardsChange } = props;
  const [loading, setLoading] = useState(true);

  const rubricId = useParams().rubric;

  const [rows, setRows] = useState([
    {
      description: "",
      scale_description: "",
    },
  ]);

  const headCells = [
    {
      id: "text",
      numeric: false,
      disablePadding: true,
      label: "Criterio",
    },
    {
      id: "scale",
      numeric: false,
      disablePadding: false,
      label: "Descripción de la escala",
    },
  ];

  useEffect(() => {
    const fetchRubric = async () => {
      await api
        .get(`api/info_rubric/${rubricId}/`)
        .then((response) => {
          setRows(response.data.standards);
          setLoading(false);
        })
        .catch((error) => {
          eventDispatcher("responseEvent", error);
          setLoading(false);
        });
    };
    fetchRubric();
  }, [rubricId]);

  const handleDescriptionChange = (index, value) => {
    const updatedStandards = [...rows];
    updatedStandards[index].description = value;
    onStandardsChange(updatedStandards);
  };

  const handleScaleDescriptionChange = (index, value) => {
    const updatedStandards = [...rows];
    updatedStandards[index].scale_description = value;
    onStandardsChange(updatedStandards);
  };
  return (
    <Fragment>
      <Sheet
        className="TableContainer"
        variant="outlined"
        sx={{
          borderRadius: "sm",
          boxShadow: "xs",
          overflow: "auto",
        }}
      >
        <Table
          borderAxis="bothBetween"
          aria-labelledby="Tabla de criterios de la rúbrica"
          stickyHeader
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "0px",
            "--TableHeader-paddingY": "12px",
            "--TableCell-paddingX": "0px",
            "& thead th": {
              paddingY: "12px",
              paddingX: "16px",
            },
            // "& thead th:nth-of-type(1)": { width: "10%" },

            "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
          }}
        >
          {/* <EnhancedTableHead
              // numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              // onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
            /> */}
          <thead>
            <tr>
              {headCells.map((headCell) => (
                <th key={headCell.id}>{headCell.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading
              ? rows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <Textarea
                        defaultValue={row.description}
                        required
                        size="sm"
                        variant="plain"
                        minRows={3}
                        maxRows={5}
                        onChange={(e) =>
                          handleDescriptionChange(index, e.target.value)
                        }
                        placeholder="Descripción del criterio"
                      />
                    </td>
                    <td>
                      <Textarea
                        defaultValue={row.scale_description}
                        // required
                        size="sm"
                        variant="plain"
                        minRows={3}
                        maxRows={5}
                        onChange={(e) =>
                          handleScaleDescriptionChange(index, e.target.value)
                        }
                        placeholder="1. El integrante del grupo no cumple con..."
                      />
                    </td>
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
    </Fragment>
  );
}
