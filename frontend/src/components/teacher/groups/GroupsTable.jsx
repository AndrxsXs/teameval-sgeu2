import UserGroupTable from "./UserGroupTable"

export default function AdminTable() {

    const columns = ["Id", "Nombre grupo", "Nombre proyecto", "Número de integrantes"];

    return (
        <UserGroupTable
            role={1}
            columns={columns}
        />
    )
}

