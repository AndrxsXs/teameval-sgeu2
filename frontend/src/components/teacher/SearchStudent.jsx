import React from "react";
import { Box } from "@mui/joy";
import { FormControl, FormLabel } from "@mui/joy";
import { Input } from "@mui/joy";

import SearchIcon from "@mui/icons-material/Search";
import SearchCode from "./SearchCode";

export default function SearchStudent() {

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
                <FormLabel>Buscar estudiante</FormLabel>
                <Input size="sm" placeholder="Buscar" startDecorator={<SearchIcon />} />
            </FormControl>
            {SearchCode()}
            
        </Box>
    )
}