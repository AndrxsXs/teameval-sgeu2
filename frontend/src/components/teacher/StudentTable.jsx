/* eslint-disable react/prop-types */
import React, { useEffect, useState, Fragment } from "react";

import api from "../../api";

import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import CircularProgress from "@mui/joy/CircularProgress";

import { ACCESS_TOKEN } from "../../constants";

import { userStatus } from "../../utils/userStatus";

import SearchField from "../admin/SearchField";
// import EditUser from "../../components/EditUser";
import DisableStudent from "../../components/DisableStudent";

function RowMenu(props) {
  const { user, endpoint } = props;

  return (
    <Box
      // size='sm'
      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
    >
      {/* <EditUser user={user} /> */}
      <DisableStudent endpoint={endpoint} user={user} />
    </Box>
  );
}

export default function StudentTable(props) {
  const { course } = props;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const disableStudentEndpoint = `api/unregister_student/${course}/`;

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

    const handleUserCreated = () => {
      fetchData();
    };

    window.addEventListener("user-created", handleUserCreated);
    window.addEventListener("user-disabled", fetchData);

    return () => {
      window.removeEventListener("user-created", handleUserCreated);
      window.removeEventListener("user-disabled", fetchData);
    };
  }, [course]);

  return (
    <React.Fragment>
      <SearchField />
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
            "& thead th:nth-of-type(1)": { width: "10%" },
            "& thead th:nth-of-type(2)": { width: "20%" },
            "& thead th:nth-of-type(3)": { width: "30%" },
            "& thead th:nth-last-of-type(2)": { width: "15%" },
            "& tr > *:last-of-type": {
              position: "sticky",
              right: 0,
              bgcolor: "var(--joy-palette-background-level1)",
              textAlign: "center",
              width: "var(--Table-lastColumnWidth)",
            },

            "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
          }}
        >
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Correo electrónico</th>
              <th>Estado</th>
              <th
                aria-label="Acciones"
                style={{
                  width: "var(--Table-lastColumnWidth)",
                  maxWidth: "fit-content",
                }}
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.code}>
                <td style={{ paddingInline: "16px" }}>
                  <Typography level="body-xs">{row.code}</Typography>
                </td>
                <td style={{ paddingInline: "16px" }}>
                  <Typography level="body-xs">
                    {row.name} {""} {row.last_name}
                  </Typography>
                </td>
                <td style={{ paddingInline: "16px" }}>
                  <Typography level="body-xs">{row.email}</Typography>
                </td>
                <td
                // style={{ paddingInline: "16px" }}
                >
                  {/* <Typography level="body-xs">{row.status}</Typography> */}
                  {row.status === "Habilitado" ? (
                    <Chip
                      color="success"
                      size="sm"
                      // startDecorator={<Check />}
                    >
                      {row.status}
                    </Chip>
                  ) : (
                    <Chip
                      color="danger"
                      size="sm"
                      // startDecorator={<Cancel />}
                    >
                      {row.status}
                    </Chip>
                  )}
                </td>
                <td style={{ paddingInline: "16px" }}>
                  <RowMenu user={row} endpoint={disableStudentEndpoint} />
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
    </React.Fragment>
  );
}
