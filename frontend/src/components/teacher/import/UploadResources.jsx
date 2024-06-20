/* eslint-disable react/prop-types */
import { Fragment, useState, useEffect } from "react";
import { Button, styled, Typography, Stack } from "@mui/joy";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";

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

export default function UploadResources({ files }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    if (files && files.length > 0) {
      // console.log('Archivos arrastrados:', files);
    }
  }, [files]);

  return (
    <Fragment>
      <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
        <Button
          component="label"
          variant="soft"
          startDecorator={<FileUploadRoundedIcon />}
          onChange={handleFileChange}
        >
          Importar recursos
          <VisuallyHiddenInput type="file" accept=".pdf" />
        </Button>
        {selectedFile && (
          <Typography
            level="body-xs"
            ariaLabel="Archivo seleccionado"
            sx={{ userSelect: "none" }}
          >
            {selectedFile.name}
          </Typography>
        )}
      </Stack>
    </Fragment>
  );
}
