import React from "react";
import { Box } from "@mui/joy";
import { FormControl, FormLabel } from "@mui/joy";
import { Input } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";



export default function SearchRubric() {
    return (
        <Box component="section" className="search-field"          
            sx={{
                alignSelf: 'flex-start',
                minWidth: '50%',
                borderRadius: 'sm',
                py: 2,
                display: 'flex',
                flexDirection: 'column', // Organiza los hijos en columna
                alignItems: 'flex-start', // Alinea los hijos al inicio
                gap: 1.5,
                '& > *': {
                    minWidth: { xs: '120px', md: '160px' },
                },
            }}
        >
            <FormLabel sx={{ alignSelf: 'flex-start' }}>Buscar rubrica</FormLabel> {/* Alinea el título al inicio */}
            <FormControl sx={{ width: '100%' }} size="sm">
                <Input size="sm" placeholder="Buscar" startDecorator={<SearchIcon />} />
            </FormControl>
        </Box>
    )
}
