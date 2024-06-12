import { useState } from "react";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import SearchField from "../../components/admin/SearchField";
import CreateAdmin from "../../components/admin/CreateAdmin";
import UserTable from "../../components/UserTable";

const headCells = [
  {
    id: "code",
    numeric: false,
    disablePadding: true,
    label: "Cédula",
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
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Estado",
  },
];

export default function ManageAdmin() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return (
    <>
      <Box
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
        <Typography level="h2" component="h1">
          Administradores
        </Typography>
        <CreateAdmin />
      </Box>
      <SearchField onSearchChange={handleSearchChange} admin />

      <UserTable
        searchTerm={searchTerm}
        role={3}
        columns={headCells}
        disableUserRoute="api/disable_user/"
        enableUserRoute="api/enable_user/"
        admin
      />
    </>
  );
}
