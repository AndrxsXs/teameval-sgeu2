/* eslint-disable react/prop-types */
import React, { useEffect, useState, Fragment } from "react";

import api from "../../api";

import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import CircularProgress from "@mui/joy/CircularProgress";

import { ACCESS_TOKEN } from "../../constants";

import { userStatus } from "../../utils/userStatus";
import { stableSort } from "../../utils/stableSort";
import { getComparator } from "../../utils/getComparator";

import EnhancedTableHead from "../EnhacedTableHead";
import EditStudent from "../../components/admin/EditStudent";
import DisableStudent from "../../components/admin/DisableStudent";
import UserInfo from "../UserInfo";

const columns = [
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

function RowMenu(props) {
  const { user, endpoint, admin } = props;

  return (
    <Box
      // size='sm'
      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
    >
      {admin && <EditStudent user={user} />}
      <DisableStudent endpoint={endpoint} user={user} />
    </Box>
  );
}

export default function StudentTable(props) {
  const { course, searchTerm, admin } = props;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("code");
  const [selected, setSelected] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const disableStudentEndpoint = `api/unregister_student/${course}/`;

  const filteredRows = searchTerm
    ? rows.filter(
        (row) =>
          row.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : rows;

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
    const fetchData = () => {
      setLoading(true);
      const token = localStorage.getItem(ACCESS_TOKEN);

      api
        .get("api/student_list/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            course: course,
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

    window.addEventListener("user-disabled", fetchData);
    window.addEventListener("user-enabled", fetchData);
    window.addEventListener("user-updated", fetchData);
    window.addEventListener("user-created", fetchData);

    return () => {
      window.removeEventListener("user-disabled", fetchData);
      window.removeEventListener("user-enabled", fetchData);
      window.removeEventListener("user-updated", fetchData);
      window.removeEventListener("user-created", fetchData);
    };
  }, [course]);

  return (
    <React.Fragment>
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
          overflow: "auto",
          minHeight: 0,
          boxShadow: "sm",
          "&:hover": {
            boxShadow: "none",
          },
          transition: "box-shadow 0.3s",
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
            "& thead th:nth-of-type(1)": { width: "10%" },
            "& thead th:nth-of-type(2)": { width: "25%" },
            "& thead th:nth-of-type(3)": { width: "25%" },
            // "& thead th:nth-last-of-type(2)": { width: "10%" },
            "& thead th:nth-last-of-type(1)": {
              width: "20%",
              textAlign: "center",
            },
          }}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            headCells={columns}
            showActions
          />
          <tbody>
            {stableSort(filteredRows, getComparator(order, orderBy)).map(
              (row) => {
                return (
                  <tr style={{ cursor: "pointer" }} key={row.code}>
                    <td
                      onClick={() => {
                        setSelectedStudent(row), setIsModalOpen(true);
                      }}
                    >
                      <Typography level="body-xs">{row.code}</Typography>
                    </td>
                    <td
                      onClick={() => {
                        setSelectedStudent(row), setIsModalOpen(true);
                      }}
                    >
                      <Typography level="body-xs">
                        {row.name} {""} {row.last_name}
                      </Typography>
                    </td>
                    <td
                      onClick={() => {
                        setSelectedStudent(row), setIsModalOpen(true);
                      }}
                    >
                      <Typography level="body-xs">{row.email}</Typography>
                    </td>
                    <td>
                      <RowMenu
                        user={row}
                        endpoint={disableStudentEndpoint}
                        enableRoute={disableStudentEndpoint}
                        admin={admin}
                      />
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
              borderTop:
                filteredRows && filteredRows.length < 1
                  ? "transparent"
                  : "1px solid",
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
      {selectedStudent && (
        <UserInfo
          user={selectedStudent}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          handleCloseModal={() => setIsModalOpen(false)}
          admin={admin}
          isStudent
          setSelectedUser={setSelectedStudent}
        />
      )}
    </React.Fragment>
  );
}
