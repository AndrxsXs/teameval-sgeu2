/* eslint-disable react/prop-types */

import UserTable from '../UserTable';

export default function AdminTable() {

    const columns = [
        "Cédula", "Nombre", "Correo electrónico", "Estado", "Acciones"
    ]

    return (
        <UserTable
            role={3}
            columns={columns}
        />
    )
}