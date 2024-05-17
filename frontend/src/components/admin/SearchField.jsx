/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Box } from "@mui/joy";
import { FormControl, FormLabel } from "@mui/joy";
import { Input } from "@mui/joy";
// import { Select, Option } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchField({ onSearchChange,
    // onStatusFilterChange
}) {
    const [searchQuery, setSearchQuery] = useState('');
    // const [statusFilter, setStatusFilter] = useState('');
    const [debounceTimer, setDebounceTimer] = useState(null);

    useEffect(() => {
        return () => clearTimeout(debounceTimer); // Limpiar el temporizador cuando el componente se desmonte
    }, [debounceTimer]);

    const handleSearchChange = (event) => {
        const newSearchQuery = event.target.value;
        setSearchQuery(newSearchQuery);

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
            onSearchChange(newSearchQuery);
        }, 500); // Delay de 1 segundo

        setDebounceTimer(timer);
    };

    // const handleStatusFilterChange = (event) => {
    //     const newStatusFilter = event.target.value;
    //     setStatusFilter(newStatusFilter);
    //     onStatusFilterChange(newStatusFilter);
    // };

    return (
        <Box component="section" className="search-field"
            sx={{
                alignSelf: 'flex-start',
                minWidth: '50%',
                borderRadius: 'sm',
                py: 2,
                display: { xs: 'none', sm: 'flex' },
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: 1.5,
                '& > *': {
                    minWidth: { xs: '120px', md: '160px' },
                },
            }}
        >
            <FormControl sx={{ flex: 1 }} size="sm">
                <FormLabel>Buscar usuario</FormLabel>
                <Input
                    value={searchQuery}
                    onChange={handleSearchChange}
                    size="sm"
                    placeholder="Código, nombre o correo electrónico"
                    startDecorator={<SearchIcon />} />
            </FormControl>

            {/* TODO: FILTRAR POR ESTADO */}

            {/* <FormControl size="sm">
                <FormLabel>Estado</FormLabel>
                <Select
                    size="sm"
                    placeholder="Filtrar por estado"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
                >
                    <Option value="">Todos</Option>
                    <Option value="true">Habilitado</Option>
                    <Option value="false">Deshabilitado</Option>
                </Select>
            </FormControl> */}
        </Box>
    )
}