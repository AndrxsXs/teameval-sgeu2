import { Fragment, useState } from "react";

import {
    Button,
    styled,
    Typography,
    Stack,

} from "@mui/joy";

import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';

const VisuallyHiddenInput = styled('input')`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
`;

export default function ImportStudents() {

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    return (
        <Fragment>
            <Stack
            direction="row"
            sx={{
                gap: 1,
                alignItems: 'center',
            
            }}
            >
                <Button
                    component="label"
                    // size="sm"
                    variant="soft"
                    startDecorator={<FileUploadRoundedIcon />}
                    onChange={handleFileChange}
                >
                    Importar estudiantes
                    <VisuallyHiddenInput type="file" accept=".csv" />
                </Button>
                {selectedFile &&
                    <Typography
                        level="body-xs"
                        ariaLabel="Archivo seleccionado"
                        sx={{
                            userSelect: 'none',
                        }}
                    >{selectedFile.name}</Typography>
                }
            </Stack>
        </Fragment>
    )
}