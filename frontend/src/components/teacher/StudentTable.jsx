import UserTable from '../UserTable';

export default function StudentTable() {

    const columns = [
        "Código", "Nombre", "Correo electrónico", "Estado", "Acciones"
    ]

    return (
        <UserTable
            role={1}
            columns={columns}
        />
    )
}