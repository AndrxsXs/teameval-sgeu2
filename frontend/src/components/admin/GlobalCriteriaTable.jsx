/* eslint-disable react/prop-types */
import { Fragment, useMemo, useState } from "react";

import api from "../../api";

import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Textarea from "@mui/joy/Textarea";
import Skeleton from "@mui/joy/Skeleton";

export default function GlobalCriteriaTable(props) {
  const { headCells, rubricId } = props;
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const handleDescriptionChange = (index, value) => {
    const updatedStandards = [...rows];
    updatedStandards[index].description = value;
  };

  const handleScaleDescriptionChange = (index, value) => {
    const updatedStandards = [...rows];
    updatedStandards[index].scale_description = value;
  };

  useMemo(() => {
    const fetchGlobalRubric = async () => {
      api
        .get(`/api/get_global_rubric/${rubricId || 1}/`)
        .then((response) => {
          console.log(response.data);
          // setRows(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    };
    fetchGlobalRubric();
  }, [rubricId]);

  return (
    <Fragment>
      <Sheet
        className="TableContainer"
        variant="outlined"
        sx={{
          borderRadius: "sm",
          boxShadow: "xs",
          overflow: "auto",
          width: "100%",
          height: "100%",
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
            {!loading ? (
              <tr>
                {headCells.map((headCell) => (
                  <th key={headCell.id}>{headCell.label}</th>
                ))}
              </tr>
            ) : (
              <tr>
                <th>
                  <Skeleton variant="text" level="body-sm" width={200} />
                </th>
                <th>
                  <Skeleton variant="text" level="body-sm" width={200} />
                </th>
              </tr>
            )}
          </thead>
          <tbody>
            {!loading ? (
              rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <Textarea
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
            ) : (
              <tr>
                <td>
                  <Skeleton variant="text" />
                </td>
                <td>
                  <Skeleton variant="text" />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>
    </Fragment>
  );
}
