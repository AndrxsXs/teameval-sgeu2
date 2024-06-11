/* eslint-disable react/prop-types */

import UserTable from "../UserTable";

export default function AdminTable(props) {
  const { searchTerm } = props;

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

  return (
    <UserTable
      searchTerm={searchTerm}
      role={3}
      columns={headCells}
      disableUserRoute="api/disable_user/"
      enableUserRoute="api/enable_user/"
    />
  );
}
