/* eslint-disable react/prop-types */

import UserTable from '../UserTable';

export default function AdminTable() {

    const columns = [
        "Código", "Nombre", "Correo electrónico", "Estado", "Acciones"
    ]

    return (
        <UserTable
            role={2}
            columns={columns}
        />
    )
}