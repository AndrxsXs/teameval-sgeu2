import { useState } from "react";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

import CreateTeacher from "../../components/admin/CreateTeacher";
import SearchField from "../../components/admin/SearchField";
import UserTable from "../../components/UserTable";
import ImportUsersModal from "../../components/teacher/ImportUsersModal";
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

export default function ManageTeachers() {
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
          Docentes
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <ImportUsersModal variant="soft" />
          <CreateTeacher />
        </Box>
      </Box>
      <SearchField onSearchChange={handleSearchChange} teacher />
      <UserTable
        searchTerm={searchTerm}
        role={2}
        columns={headCells}
        disableUserRoute="api/disable_user/"
        enableUserRoute="api/enable_user/"
        admin
      />
    </>
  );
}
