import UserTable from '../UserTable';

export default function StudentTable() {

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