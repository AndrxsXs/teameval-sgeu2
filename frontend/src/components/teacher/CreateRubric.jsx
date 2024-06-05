/* eslint-disable react/prop-types */
import * as React from "react";
import { useState } from "react";
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add";
import ModalFrame from "../ModalFrame";
import Box from "@mui/joy/Box";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Textarea from "@mui/joy/Textarea";

import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import { Fragment } from "react";

import IconButton from "@mui/joy/IconButton";
import CloseRounded from "@mui/icons-material/CloseRounded";

import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";

import Stack from "@mui/joy/Stack";

const headCells = [
  {
    id: "text",
    numeric: false,
    disablePadding: true,
    label: "Criterio",
  },
  {
    id: "scale",
    numeric: false,
    disablePadding: false,
    label: "Descripción de la escala (Opcional)",
  },
];

function CriteriaTable(props) {
  const { rows, headCells } = props;

  return (
    <Fragment>
      <Sheet
        className="TableContainer"
        variant="outlined"
        sx={{
          borderRadius: "sm",
          boxShadow: "xs",
        }}
      >
        <Table
          borderAxis="bothBetween"
          aria-labelledby="Tabla de criterios de la rúbrica"
          stickyHeader
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "0px",
            "--TableHeader-paddingY": "12px",
            "--TableCell-paddingX": "0px",
            "& thead th": {
              paddingY: "12px",
              paddingX: "16px",
            },
            // "& thead th:nth-of-type(1)": { width: "10%" },

            "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
          }}
        >
          {/* <EnhancedTableHead
            // numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            // onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            headCells={headCells}
          /> */}
          <thead>
            <tr>
              {headCells.map((headCell) => (
                <th key={headCell.id}>{headCell.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <Textarea
                    required
                    size="sm"
                    variant="plain"
                    minRows={3}
                    maxRows={5}
                    onChange={(e, value) => (row.description = value)}
                    placeholder="Descripción del criterio"
                  />
                </td>
                <td>
                  <Textarea
                    size="sm"
                    variant="plain"
                    minRows={3}
                    maxRows={5}
                    onChange={(e, value) => (row.scale_description = value)}
                    placeholder="1. El integrante del grupo no cumple con..."
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Fragment>
  );
}

export default function CreateRubric() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const action = React.useRef(null);
  const [rubric, setRubric] = useState({
    name: "",
    standards: [
      {
        description: "",
        scale_description: "",
      },
    ],
    scale: {
      Lower_limit: 1,
      Upper_limit: null,
    },
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (value) => {
    setIsModalOpen(value);
  };

  return (
    <React.Fragment>
      <Button
        color="primary"
        // size="sm"
        startDecorator={<Add />}
        onClick={handleOpenModal}
      >
        Nueva rubrica
      </Button>
      <ModalFrame
        open={isModalOpen}
        onClose={handleCloseModal}
        ModalTitle="Crear rubrica"
      >
        <form>
          <Stack
            component="article"
            direction="column"
            gap={2}
            sx={{
              width: "100%",
              height: "100%",
              overflow: "auto",
              padding: 1,
            }}
          >
            <Stack
              direction="column"
              sx={{
                width: "1000px",
                height: "clamp(400px, 70vh, 700px)",
                // overflow: "auto",
                gap: 2,
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Stack
                component="section"
                direction={{ xs: "column", sm: "row" }}
                gap={2}
                sx={{
                  width: "60%",
                  "& > *": {
                    width: "50%",
                  },
                }}
              >
                <FormControl>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    size="sm"
                    placeholder="Nombre de la rúbrica"
                    value={rubric.name}
                    onChange={(e) =>
                      setRubric({ ...rubric, name: e.target.value })
                    }
                    required
                  />

                  <FormHelperText>
                    Este será el nombre de la rúbrica.
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel>Escala</FormLabel>
                  <Select
                    required
                    action={action}
                    placeholder="Desde 1 hasta..."
                    size="sm"
                    value={rubric.scale.Upper_limit}
                    onChange={(e, value) => {
                      setRubric({
                        ...rubric,
                        scale: {
                          ...rubric.scale,
                          Upper_limit: value,
                        },
                      });
                    }}
                    {...(rubric.scale.Upper_limit && {
                      endDecorator: (
                        <IconButton
                          size="xs"
                          variant="plain"
                          color="neutral"
                          onMouseDown={(event) => {
                            // don't open the popup when clicking on this button
                            event.stopPropagation();
                          }}
                          onClick={() =>
                            setRubric({
                              ...rubric,
                              scale: {
                                ...rubric.scale,
                                Upper_limit: null,
                              },
                            })
                          }
                        >
                          <CloseRounded />
                        </IconButton>
                      ),
                      indicator: null,
                    })}
                  >
                    {Array.from(new Array(9)).map((_, index) => (
                      <Option key={index} value={index + 2}>
                        {index + 2}
                      </Option>
                    ))}

                    {/* <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                    <Option value="5">5</Option>
                    <Option value="6">6</Option>
                    <Option value="7">7</Option>
                    <Option value="8">8</Option>
                    <Option value="9">9</Option>
                    <Option value="10">10</Option> */}
                  </Select>
                  <FormHelperText>
                    Seleccione el límite superior de la escala de la rúbrica.
                  </FormHelperText>
                </FormControl>

                {/* <FormControl>
                  <FormLabel>Fecha de inicio</FormLabel>
                  <Input
                    type="date"
                    slotProps={{
                      input: {
                        min: "2024-01-01",
                        max: "2025-12-12",
                      },
                    }}
                    value={evaluation.start_date}
                    onChange={(e) =>
                      setEvaluation({ ...evaluation, start_date: e.target.value })
                    }
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Fecha de finalización</FormLabel>
                  <Input
                    type="date"
                    slotProps={{
                      input: {
                        min: "2024-01-01",
                        max: "2025-12-12",
                      },
                    }}
                    value={evaluation.end_date}
                    onChange={(e) =>
                      setEvaluation({ ...evaluation, end_date: e.target.value })
                    }
                    required
                  />
                </FormControl> */}
              </Stack>

              <CriteriaTable rows={rubric.standards} headCells={headCells} />
            </Stack>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignSelf: "flex-end",
              }}
            >
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outlined"
                color="neutral"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                //   loading={loading}
              >
                Crear
              </Button>
            </Box>
          </Stack>
        </form>
      </ModalFrame>
    </React.Fragment>
  );
}
