/* eslint-disable react/prop-types */
import React, { useEffect, useState, Fragment } from "react";

import api from "../api";

import { stableSort } from "../utils/stableSort";
import { getComparator } from "../utils/getComparator";

import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import CircularProgress from "@mui/joy/CircularProgress";

import { ACCESS_TOKEN } from "../constants";

import { userStatus } from "../utils/userStatus";

// import SearchField from "./admin/SearchField";
import EditUser from "../components/EditUser";
import DisableUser from "../components/DisableUser";
import EnableUser from "../components/EnableUser";
import EnhancedTableHead from "./EnhacedTableHead";
import UserInfo from "./UserInfo";

function RowMenu(props) {
  const { user, disableRoute, enableRoute } = props;

  return (
    <Box
      // size='sm'
      sx={{ display: "flex", gap: 1 }}
    >
      <EditUser user={user} />
      {user.status === "Habilitado" ? (
        <DisableUser user={user} endpoint={disableRoute} />
      ) : (
        <EnableUser user={user} endpoint={enableRoute} />
      )}
    </Box>
  );
}

export default function UserTable(props) {
  const {
    role,
    columns,
    disableUserRoute,
    enableUserRoute,
    searchTerm,
    admin,
  } = props;

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("code");
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem(ACCESS_TOKEN);

      await api
        .get(`api/user_list/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            role: role,
          },
        })
        .then((userList) => {
          const users = userList.data.map((user) => {
            return {
              code: user.code,
              name: user.name,
              last_name: user.last_name,
              email: user.email,
              phone: user.phone,
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
  }, [role]);

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
            "& thead th:nth-of-type(2)": { width: "20%" },
            "& thead th:nth-of-type(3)": { width: "25%" },
            // "& thead th:nth-last-of-type(2)": { width: "10%" },
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
                  <tr
                    key={row.code}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <td
                      onClick={() => {
                        setSelectedUser(row), setIsModalOpen(true);
                      }}
                    >
                      <Typography level="body-xs">{row.code}</Typography>
                    </td>
                    <td
                      onClick={() => {
                        setSelectedUser(row), setIsModalOpen(true);
                      }}
                    >
                      <Typography level="body-xs">
                        {row.name} {""} {row.last_name}
                      </Typography>
                    </td>
                    <td
                      onClick={() => {
                        setSelectedUser(row), setIsModalOpen(true);
                      }}
                    >
                      <Typography level="body-xs">{row.email}</Typography>
                    </td>
                    <td
                      onClick={() => {
                        setSelectedUser(row), setIsModalOpen(true);
                      }}
                    >
                      <Chip
                        size="sm"
                        variant="soft"
                        color={
                          row.status === "Habilitado" ? "success" : "danger"
                        }
                      >
                        {row.status}
                      </Chip>
                    </td>
                    <td>
                      <RowMenu
                        user={row}
                        disableRoute={disableUserRoute}
                        enableRoute={enableUserRoute}
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
      {selectedUser && (
        <UserInfo
          user={selectedUser}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          handleCloseModal={() => setIsModalOpen(false)}
          admin={admin}
          setSelectedUser={setSelectedUser}
        />
      )}
    </React.Fragment>
  );
}
