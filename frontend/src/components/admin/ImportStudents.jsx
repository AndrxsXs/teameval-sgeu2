import { Fragment, useState, useEffect } from "react";
import { readString } from "react-papaparse";

import {
    Button,
    styled,
    Typography,
    Stack,
    Table,
    Chip,
    ChipDelete,
    Sheet,
} from "@mui/joy";

import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

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

    const [csvData, setCsvData] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    useEffect(() => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = () => {
                const results = readString(reader.result, { header: true });
                setCsvData(results.data);
            };
            reader.readAsText(selectedFile);
        } else {
            setCsvData([]);
        }
    }, [selectedFile]);

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
                    <Chip
                        aria-label="Archivo seleccionado"
                        variant="soft"
                        // color="danger"
                        endDecorator={
                            <ChipDelete
                                color="danger"
                                variant="plain"
                                onClick={() => setSelectedFile(null)}
                            >
                                <ClearRoundedIcon />
                            </ChipDelete>
                        }
                    >
                        <Typography
                            level="body-xs"
                            aria-label="Archivo seleccionado"
                            sx={{
                                userSelect: 'none',
                            }}
                        >{selectedFile.name}</Typography>
                    </Chip>
                }
            </Stack>

            {csvData.length > 0 && (
                <>
                    <Typography level="body-xs">Revise los datos, <Typography color="danger">no</Typography> podrá deshacer la acción.</Typography>
                    <Sheet
                        variant="outlined"
                        sx={{
                            width: '100%',
                            maxWidth: '500px',
                            height: 'clamp( 10dvh, 38dvh, 500px)',
                            overflow: 'auto',
                            borderRadius: "sm",
                        }}
                    >
                        <Table
                            size="sm"
                            stickyFooter
                            stickyHeader
                            aria-label="Tabla de datos importados"
                            sx={{
                                "--TableCell-headBackground":
                                    "var(--joy-palette-background-level1)",
                                "--Table-headerUnderlineThickness": "1px",
                                "--TableRow-hoverBackground":
                                    "var(--joy-palette-background-level1)",
                                "--TableCell-paddingY": "4px",
                                "--TableCell-paddingX": "8px",
                            }}
                        >
                            <thead>
                                <tr>
                                    {Object.keys(csvData[0]).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {csvData.map((row, index) => (
                                    <tr key={index}>
                                        {Object.values(row).map((value, index) => (
                                            <td style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',

                                            }} key={index}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={Object.keys(csvData[0]).length}>
                                        {csvData.length} personas importadas
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>
                    </Sheet>
                </>
            )}
        </Fragment>
    )
}