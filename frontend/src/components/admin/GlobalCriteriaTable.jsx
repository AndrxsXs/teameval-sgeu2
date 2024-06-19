/* eslint-disable react/prop-types */
import { Fragment, useMemo, useState } from "react";

import api from "../../api";
import eventDispatcher from "../../utils/eventDispacher";

import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import Skeleton from "@mui/joy/Skeleton";

export default function GlobalCriteriaTable(props) {
  const { headCells, setRubricInfo } = props;
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [empty, setEmpty] = useState(false);

  useMemo(() => {
    const fetchGlobalRubric = async () => {
      api
        .get(`/api/get_global_rubric/`)
        .then((response) => {
          // console.log(response.data);
          setRubricInfo(response.data);
          setRows(response.data.standards);
          setLoading(false);
        })
        .catch((error) => {
          // console.error(error);
          eventDispatcher("responseEvent", error, "danger");
          setEmpty(true);
          setLoading(false);
        });
    };

    fetchGlobalRubric();
    window.addEventListener("load", fetchGlobalRubric);

    return () => {
      window.removeEventListener("load", fetchGlobalRubric);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      {!empty ? (
        <Sheet
          className="TableContainer"
          variant="outlined"
          sx={{
            borderRadius: "sm",
            boxShadow: "md",
            "&:hover": {
              boxShadow: "none",
            },
            transition: "box-shadow 0.3s",
            overflow: "auto",
            width: "100%",
            maxHeight: "100%",
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
              "--TableCell-paddingX": "16px",
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
              {!loading
                ? rows.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <Sheet>
                          <Typography level="body-sm">
                            {row.description}
                          </Typography>
                        </Sheet>
                        {/* <Textarea
                        required
                        size="sm"
                        variant="plain"
                        minRows={3}
                        maxRows={5}
                        // onChange={(e) =>
                        //   handleDescriptionChange(index, e.target.value)
                        // }
                        placeholder="Descripción del criterio"
                      /> */}
                      </td>
                      <td>
                        <Sheet>
                          <Typography level="body-sm">
                            {row.scale_description}
                          </Typography>
                        </Sheet>
                        {/* <Textarea
                        // required
                        size="sm"
                        variant="plain"
                        minRows={3}
                        maxRows={5}
                        // onChange={(e) =>
                        //   handleScaleDescriptionChange(index, e.target.value)
                        // }
                        placeholder="1. El integrante del grupo no cumple con..."
                      /> */}
                      </td>
                    </tr>
                  ))
                : Array.from(new Array(9)).map(() => {
                    const id = crypto.randomUUID();
                    return (
                      <tr key={id}>
                        <td>
                          <Skeleton animation="wave" variant="text" />
                        </td>
                        <td>
                          <Skeleton animation="wave" variant="text" />
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </Table>
        </Sheet>
      ) : (
        <>
          <Typography level="body-sm">
            No hay criterios globales. Para comenzar cree una rúbrica global con
            el botón{" "}
            <Typography variant="soft" color="primary">
              Nueva rúbrica global
            </Typography>
            .
          </Typography>
        </>
      )}
    </Fragment>
  );
}
