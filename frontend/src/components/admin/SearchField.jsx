import React from "react";
import { Box } from "@mui/joy";
import { FormControl, FormLabel } from "@mui/joy";
import { Input } from "@mui/joy";
import { Select, Option } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";

export default function SerachField() {


    const renderFilters = () => (
        <React.Fragment>
            <FormControl size="sm">
                <FormLabel>Estado</FormLabel>
                <Select
                    size="sm"
                    placeholder="Filtrar por estado"
                    slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
                >
                    <Option value="enabled">Habilitado</Option>
                    <Option value="disabled">Deshabilitado</Option>
                </Select>
            </FormControl>
        </React.Fragment>
    );

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
                <FormLabel>Buscar administrador</FormLabel>
                <Input size="sm" placeholder="Buscar" startDecorator={<SearchIcon />} />
            </FormControl>
            {renderFilters()}
        </Box>
    )
}