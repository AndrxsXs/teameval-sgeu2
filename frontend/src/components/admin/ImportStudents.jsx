/* eslint-disable react/prop-types */
import { Fragment, useState, useEffect } from "react";
import { readString } from "react-papaparse";

import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Table from "@mui/joy/Table";
import Chip from "@mui/joy/Chip";
import ChipDelete from "@mui/joy/ChipDelete";
import Sheet from "@mui/joy/Sheet";
import { styled } from "@mui/joy";

import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

const VisuallyHiddenInput = styled("input")`
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

export default function ImportStudents({ onFileChange, isStudent, file }) {
  const [csvData, setCsvData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(file || null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    onFileChange(file); // Llamar a la función de devolución de llamada con el archivo seleccionado
  };

  const handleButtonClick = (event) => {
    // Restablecer el valor del input de archivo
    event.target.value = null;
  };

  useEffect(() => {
    if (file === null) {
      setSelectedFile(null);
    }
  }, [file]);

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
          alignItems: "center",
        }}
      >
        <Button
          component="label"
          // size="sm"
          variant="soft"
          startDecorator={<FileUploadRoundedIcon />}
          onClick={handleButtonClick}
          onChange={handleFileChange}
        >
          Importar {isStudent ? "estudiantes" : "docentes"}
          <VisuallyHiddenInput type="file" accept=".csv" />
        </Button>

        {selectedFile && (
          <Chip
            aria-label="Archivo seleccionado"
            variant="soft"
            // color="danger"
            endDecorator={
              <ChipDelete
                color="danger"
                variant="plain"
                onClick={() => (setSelectedFile(null), handleFileChange)}
              >
                <ClearRoundedIcon />
              </ChipDelete>
            }
          >
            <Typography
              level="body-xs"
              aria-label="Archivo seleccionado"
              sx={{
                userSelect: "none",
              }}
            >
              {selectedFile.name}
            </Typography>
          </Chip>
        )}
      </Stack>

      {csvData.length > 0 && (
        <>
          <Typography level="body-xs">
            Revise los datos, <Typography color="danger">no</Typography> podrá
            deshacer la acción.
          </Typography>
          <Sheet
            variant="outlined"
            sx={{
              width: "100%",
              maxWidth: "500px",
              // height: 'clamp( 10dvh, 28dvh, 500px)',
              height: "28dvh",
              display: { xs: "none", sm: "block" },
              overflow: "auto",
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
                "& thead th:nth-of-type(1)": { width: "15%" },
                "& thead th:nth-of-type(2)": { width: "20%" },
                "& thead th:nth-of-type(3)": { width: "15%" },
                // "& thead th:nth-last-of-type(2)": { width: "10%" },
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
                      <td
                        style={{
                          maxWidth: "100px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        key={index}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={Object.keys(csvData[0]).length}>
                    {csvData.length - 1} personas
                  </td>
                </tr>
              </tfoot>
            </Table>
          </Sheet>
        </>
      )}
    </Fragment>
  );
}
