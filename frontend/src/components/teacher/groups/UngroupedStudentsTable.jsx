/* eslint-disable react/prop-types */
import { useState, useEffect, Fragment } from "react";

import api from "../../../api";
import { ACCESS_TOKEN } from "../../../constants";
import { userStatus } from "../../../utils/userStatus";

import { getComparator } from "../../../utils/getComparator";
import { stableSort } from "../../../utils/stableSort";

import EnhancedTableHead from "../../EnhacedTableHead";

import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import CircularProgress from "@mui/joy/CircularProgress";
import Checkbox from "@mui/joy/Checkbox";

const headCells = [
  {
    id: "code",
    numeric: false,
    disablePadding: true,
    label: "Código",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Nombre",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Correo electrónico",
  },
];

export default function UngroupedStudentsTable({
  course,
  onSelectedStudentsChange,
}) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("code");
  //   const [selected,setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const course_code = course;

  const [selectedStudents, setSelectedStudents] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  //   const handleSelectAllClick = (event) => {
  //     if (event.target.checked) {
  //       const newSelected = rows.map((n) => n.name);
  //       setSelected(newSelected);
  //       return;
  //     }
  //     setSelected([]);
  //   };

  //   const handleClick = (event, name) => {
  //     const selectedIndex = selected.indexOf(name);
  //     let newSelected = [];

  //     if (selectedIndex === -1) {
  //       newSelected = newSelected.concat(selected, name);
  //     } else if (selectedIndex === 0) {
  //       newSelected = newSelected.concat(selected.slice(1));
  //     } else if (selectedIndex === selected.length - 1) {
  //       newSelected = newSelected.concat(selected.slice(0, -1));
  //     } else if (selectedIndex > 0) {
  //       newSelected = newSelected.concat(
  //         selected.slice(0, selectedIndex),
  //         selected.slice(selectedIndex + 1)
  //       );
  //     }

  //     setSelected(newSelected);
  //   };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedStudents = rows.map((n) => n.code);
      setSelectedStudents(newSelectedStudents);
      onSelectedStudentsChange(newSelectedStudents);
      return;
    }
    setSelectedStudents([]);
    onSelectedStudentsChange([]);
  };

  const handleClick = (event, code) => {
    const selectedIndex = selectedStudents.indexOf(code);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedStudents, code);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedStudents.slice(1));
    } else if (selectedIndex === selectedStudents.length - 1) {
      newSelected = newSelected.concat(selectedStudents.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedStudents.slice(0, selectedIndex),
        selectedStudents.slice(selectedIndex + 1)
      );
    }

    setSelectedStudents(newSelected);
    onSelectedStudentsChange(newSelected);
  };

  //   const isSelected = (name) => selected.indexOf(name) !== -1;

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      const token = localStorage.getItem(ACCESS_TOKEN);

      api
        .get(`api/ungrouped_students/${course_code}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((userList) => {
          const users = userList.data.map((user) => {
            return {
              code: user.code,
              name: user.name,
              last_name: user.last_name,
              email: user.email,
              status: userStatus(user.status),
            };
          });
          setRows(users);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchData();
  }, [course_code]);

  return (
    <Fragment>
      <Sheet
        className="TableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "flex" },
          flexFlow: "column",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          minHeight: 0,
          maxHeight: "calc(100vh - 300px)",
          boxShadow: "sm",
          transition: "box-shadow 0.3s",
          "&:hover": {
            boxShadow: "none",
          },
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
          aria-labelledby="Tabla de estudiantes sin grupo asignado"
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
            "& thead th:nth-of-type(1)": { width: "10%" },
            "& thead th:nth-of-type(2)": { width: "20%" },
            "& thead th:nth-of-type(3)": { width: "25%" },
            // "& thead th:last-of-type": { width: "10%" },

            "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
          }}
        >
          <EnhancedTableHead
            numSelected={selectedStudents.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            headCells={headCells}
            showCheckbox
          />
          <tbody>
            {stableSort(rows, getComparator(order, orderBy)).map(
              (row, index) => {
                const isItemSelected =
                  selectedStudents.indexOf(row.code) !== -1;
                const labelId = `enhanced-table-checkbox-${index}`;
                const id = crypto.randomUUID();
                return (
                  <tr
                    onClick={(event) => handleClick(event, row.code)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={id}
                    // selected={isItemSelected}
                    style={
                      (isItemSelected
                        ? {
                            "--TableCell-dataBackground":
                              "var(--TableCell-selectedBackground)",
                            "--TableCell-headBackground":
                              "var(--TableCell-selectedBackground)",
                          }
                        : {},
                      {
                        cursor: "pointer",
                      })
                    }
                  >
                    <th scope="row">
                      <Checkbox
                        checked={isItemSelected}
                        slotProps={{
                          input: {
                            "aria-labelledby": labelId,
                          },
                        }}
                        sx={{ verticalAlign: "top" }}
                      />
                    </th>
                    <td>
                      <Typography level="body-xs">{row.code}</Typography>
                    </td>
                    <td>
                      <Typography level="body-xs">
                        {row.name} {row.last_name}
                      </Typography>
                    </td>
                    <td>
                      <Typography level="body-xs">{row.email}</Typography>
                    </td>
                  </tr>
                );
              }
            )}
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
              borderTop: rows && rows.length < 1 ? "transparent" : "1px solid",
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
              borderTop: rows && rows.length < 1 ? "transparent" : "1px solid",
              borderTopColor: "divider",
              userSelect: "none",
            }}
          >
            {rows && rows.length === 0 ? (
              <Fragment>No hay usuarios</Fragment>
            ) : (
              <Fragment>Nada más por aquí</Fragment>
            )}
          </Typography>
        )}
      </Sheet>
    </Fragment>
  );
}
