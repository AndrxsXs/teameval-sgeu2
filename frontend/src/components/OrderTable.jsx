import * as React from 'react';
// import { ColorPaletteProp } from '@mui/joy/styles';
// import Avatar from '@mui/joy/Avatar';
// import Box from '@mui/joy/Box';
// import Button from '@mui/joy/Button';
// import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
// import FormControl from '@mui/joy/FormControl';
// import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
// import Input from '@mui/joy/Input';
// import Modal from '@mui/joy/Modal';
// import ModalDialog from '@mui/joy/ModalDialog';
// import ModalClose from '@mui/joy/ModalClose';
// import Select from '@mui/joy/Select';
// import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
// import Checkbox from '@mui/joy/Checkbox';
// import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

// import FilterAltIcon from '@mui/icons-material/FilterAlt';
// import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
// import BlockIcon from '@mui/icons-material/Block';
// import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';

const rows = [
    {
        user: {
            cedula: "1221112",
            role: "admin",
            name: "Olivia",
            lastname: "Sanders",
            email: "olivia@email.com",
            phone: "",
            status: "Habilitado"
        }
    },
    {
        user: {
            cedula: "2546585",
            role: "admin",
            name: "Olivia",
            lastname: "Sanders",
            email: "olivia@email.com",
            phone: "",
            status: "Deshabilitado"
        }
    },
    {
        user: {
            cedula: "3664455",
            role: "admin",
            name: "Olivia",
            lastname: "Sanders",
            email: "olivia@email.com",
            phone: "",
            status: "Habilitado"
        }
    },
]

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) {
            return order
        }
        return a[1] - b[1]
    })
    return stabilizedThis.map(el => el[0])
}

function RowMenu() {
    return (
        <Dropdown>
            <MenuButton
                // slots={{ root: IconButton }}
                // slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
                variant='pain'
                color='neutral'
                size='sm'
            >
                <MoreHorizRoundedIcon />
            </MenuButton>
            <Menu size="sm" sx={{ minWidth: 140 }}>
                <MenuItem>
                    <EditRoundedIcon />
                    Editar
                </MenuItem>
                <Divider />
                <MenuItem color="danger">
                    <DisabledByDefaultRoundedIcon />
                    Deshabilitar</MenuItem>
            </Menu>
        </Dropdown>
    )
}

export default function OrderTable() {
    const [user, setUser] = React.useState("desc")
    // const [selected, setSelected] = React.useState([])

    return (
        <React.Fragment>
            <Sheet
                className="TableContainer"
                variant="outlined"
                sx={{
                    display: { xs: "none", sm: "initial" },
                    width: "100%",
                    borderRadius: "sm",
                    flexShrink: 1,
                    overflow: "auto",
                    minHeight: 0
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    stickyHeader
                    hoverRow
                    sx={{
                        "--TableCell-headBackground":
                            "var(--joy-palette-background-level1)",
                        "--Table-headerUnderlineThickness": "1px",
                        "--TableRow-hoverBackground":
                            "var(--joy-palette-background-level1)",
                        "--TableCell-paddingY": "4px",
                        "--TableCell-paddingX": "8px"
                    }}
                >
                    <thead>
                        <tr>
                            {/* <th
                                style={{ width: 48, textAlign: "center", padding: "12px 6px" }}
                            >
                                <Checkbox
                                    size="sm"
                                    indeterminate={
                                        selected.length > 0 && selected.length !== rows.length
                                    }
                                    checked={selected.length === rows.length}
                                    onChange={event => {
                                        setSelected(
                                            event.target.checked ? rows.map(row => row.id) : []
                                        )
                                    }}
                                    color={
                                        selected.length > 0 || selected.length === rows.length
                                            ? "primary"
                                            : undefined
                                    }
                                    sx={{ verticalAlign: "text-bottom" }}
                                />
                            </th> */}
                            <th style={{ width: 120, padding: "12px 16px" }}>
                                <Link
                                    underline="none"
                                    color="primary"
                                    component="button"
                                    onClick={() => setUser(user === "asc" ? "desc" : "asc")}
                                    fontWeight="lg"
                                    endDecorator={<ArrowDropDownIcon />}
                                    sx={{
                                        "& svg": {
                                            transition: "0.2s",
                                            transform:
                                                user === "desc" ? "rotate(0deg)" : "rotate(180deg)"
                                        }
                                    }}
                                >
                                    Cédula
                                </Link>
                            </th>
                            <th style={{ width: 140, padding: "12px 6px" }}>Nombre</th>
                            <th style={{ width: 140, padding: "12px 6px" }}>Correo electrónico</th>
                            <th style={{ width: 140, padding: "12px 6px" }}>Estado</th>
                            <th style={{ width: 140, padding: "12px 6px" }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stableSort(rows, getComparator(user, "cedula")).map(row => (
                            <tr key={row.cedula}>
                                {/* <td style={{ textAlign: "center", width: 120 }}>
                                    <Checkbox
                                        size="sm"
                                        checked={selected.includes(row.id)}
                                        color={selected.includes(row.id) ? "primary" : undefined}
                                        onChange={event => {
                                            setSelected(ids =>
                                                event.target.checked
                                                    ? ids.concat(row.id)
                                                    : ids.filter(itemId => itemId !== row.id)
                                            )
                                        }}
                                        slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                                        sx={{ verticalAlign: "text-bottom" }}
                                    />
                                </td> */}
                                <td style={{ paddingLeft: '16px' }}>
                                    <Typography level="body-xs">{row.user.cedula}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-xs">{row.user.name} {''} {row.user.lastname}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-xs">{row.user.email}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-xs">{row.user.status}</Typography>
                                </td>
                                <td>
                                    <RowMenu />
                                </td>
                                {/* <td>
                                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                        <Avatar size="sm">{row.customer.initial}</Avatar>
                                        <div>
                                            <Typography level="body-xs">
                                                {row.customer.name}
                                            </Typography>
                                            <Typography level="body-xs">
                                                {row.customer.email}
                                            </Typography>
                                        </div>1
Olivia
Sanders
olivia@email.com
2
Olivia
Sanders
olivia@email.com
3
Olivia
                                    </Box>
                                </td> */}

                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet>
            {/* <Box
                className="Pagination-laptopUp"
                sx={{
                    pt: 2,
                    gap: 1,
                    [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
                    display: {
                        xs: "none",
                        md: "flex"
                    }
                }}
            >
                <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    startDecorator={<KeyboardArrowLeftIcon />}
                >
                    Anterior
                </Button>

                <Box sx={{ flex: 1 }} />
                {["1", "2", "3", "…", "8", "9", "10"].map(page => (
                    <IconButton
                        key={page}
                        size="sm"
                        variant={Number(page) ? "outlined" : "plain"}
                        color="neutral"
                    >
                        {page}
                    </IconButton>
                ))}
                <Box sx={{ flex: 1 }} />

                <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    endDecorator={<KeyboardArrowRightIcon />}
                >
                    Siguiente
                </Button>
            </Box> */}
        </React.Fragment>
    )
}
