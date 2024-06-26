/* eslint-disable react/prop-types */
import { Fragment, useState, useEffect } from "react";

import api from "../../../api";

import { getComparator } from "../../../utils/getComparator";
import { stableSort } from "../../../utils/stableSort";

import EnhancedTableHead from "../../EnhacedTableHead";
import EditUser from "../../EditUser";
import DisableUser from "../../DisableUser";

// import Checkbox from "@mui/joy/Checkbox";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Box from "@mui/joy/Box";
import CircularProgress from "@mui/joy/CircularProgress";
import Typography from "@mui/joy/Typography";

import IconButton from "@mui/joy/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useParams } from "react-router";

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Nombre",
  },
  {
    id: "project",
    numeric: false,
    disablePadding: false,
    label: "Proyecto asignado",
  },
  {
    id: "studentCount",
    numeric: false,
    disablePadding: false,
    label: "Número de estudiantes",
  },
  //   {
  //     id: "actions",
  //     numeric: false,
  //     disablePadding: false,
  //     label: "Acciones",
  //   },
];

function RowMenu(props) {
  const { target } = props;

  return (
    <Box
      // size='sm'
      sx={{ display: "flex", gap: 1 }}
    >
      <EditUser user={target} />
      <DisableUser user={target} />
    </Box>
  );
}

function Row(props) {
  const { row, courseId } = props;
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(props.initialOpen || false);
  // const { courseId } = useParams();

  useEffect(() => {
    const fetchStudents = async () => {
      await api
        .get(`api/group_detail/${courseId}/${row.id}/`)
        .then((response) => {
          // console.log(response.data.students);
          setStudents(response.data.students);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    if (open) {
      fetchStudents();

      window.addEventListener("group-disabled", fetchStudents);
      window.addEventListener("group-enabled", fetchStudents);
      window.addEventListener("group-updated", fetchStudents);
      window.addEventListener("group-created", fetchStudents);

      return () => {
        window.removeEventListener("group-disabled", fetchStudents);
        window.removeEventListener("group-enabled", fetchStudents);
        window.removeEventListener("group-updated", fetchStudents);
        window.removeEventListener("group-created", fetchStudents);
      };
    }
  }, [open, courseId, row.id]);

  return (
    <Fragment>
      <tr>
        <td
          onClick={() => setOpen(!open)}
          style={{
            cursor: "pointer",
          }}
        >
          <IconButton
            aria-label="expand row"
            variant="plain"
            color="neutral"
            size="sm"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </td>
        <td
          onClick={() => setOpen(!open)}
          style={{
            cursor: "pointer",
          }}
        >
          <Typography level="body-xs">{row.name}</Typography>
        </td>
        <td
          onClick={() => setOpen(!open)}
          style={{
            cursor: "pointer",
          }}
        >
          <Typography level="body-xs">{row.assigned_project}</Typography>
        </td>
        <td
          onClick={() => setOpen(!open)}
          style={{
            cursor: "pointer",
          }}
        >
          <Typography level="body-xs">{row.student_count}</Typography>
        </td>
        {/* <td>
          <RowMenu target={row} />
        </td> */}
      </tr>
      {open && (
        <tr>
          <td style={{ height: 0, padding: 0 }} colSpan={4}>
            <Sheet
              variant="soft"
              sx={{
                p: 1,
                pl: 6,
                boxShadow: "inset 0 3px 6px 0 rgba(0 0 0 / 0.08)",
              }}
            >
              <Typography level="title-md">
                Estudiantes del grupo {row.name}
              </Typography>
              <Table
                borderAxis="bothBetween"
                size="sm"
                aria-label="Estudiantes del grupo"
                sx={{
                  "--TableCell-paddingX": "0.5rem",
                  "& > thead th:nth-of-type(1)": {
                    width: "20%",
                  },
                }}
              >
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Correo electrónico</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((row) => (
                    <tr key={row.student_code}>
                      <th scope="row">{row.student_code}</th>
                      <td>{row.student_name}</td>
                      <td>{row.student_email}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>
          </td>
        </tr>
      )}
    </Fragment>
  );
}

export default function GroupsTable({ course }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      const token = localStorage.getItem("ACCESS_TOKEN");
      await api
        .get(`api/group_list/${course}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setRows(response.data);
          // console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchGroups();

    window.addEventListener("group-created", fetchGroups);
    window.addEventListener("group-updated", fetchGroups);
    window.addEventListener("group-deleted", fetchGroups);
  }, [course]);

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
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            headCells={headCells}
            // showActions
            showEmptyColumn
          />
          <tbody>
            {stableSort(rows, getComparator(order, orderBy)).map((row) => {
              return <Row key={row.id} row={row} courseId={course} />;
            })}
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
              <Fragment>No hay grupos</Fragment>
            ) : (
              <Fragment>Nada más por aquí</Fragment>
            )}
          </Typography>
        )}
      </Sheet>
    </Fragment>
  );
}

// {
//     id: 1,
//     name: 'Grupo tal',
//     assigned_project: 'Proyecto predeterminado',
//     student_count: 4
//   }
