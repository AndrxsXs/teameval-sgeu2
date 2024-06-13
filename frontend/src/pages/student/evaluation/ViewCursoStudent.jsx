/* eslint-disable react/prop-types */
import * as React from "react";
import { useState } from "react";
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add";
import ModalFrame from "../../../components/ModalFrame";
import Box from "@mui/joy/Box";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Textarea from "@mui/joy/Textarea";



import api from "../../../api";
import { useParams } from "react-router-dom";

import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import { Fragment } from "react";

import IconButton from "@mui/joy/IconButton";
import CloseRounded from "@mui/icons-material/CloseRounded";

import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";

import Stack from "@mui/joy/Stack";

import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemButton from '@mui/joy/ListItemButton';
import Autocomplete from '@mui/joy/Autocomplete';

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
    label: "Descripción de la escala",
  },
];

function CriteriaTable(props) {
  const { rows, headCells, onStandardsChange } = props;

  const handleDescriptionChange = (index, value) => {
    const updatedStandards = [...rows];
    updatedStandards[index].description = value;
    onStandardsChange(updatedStandards);
  };

  const handleScaleDescriptionChange = (index, value) => {
    const updatedStandards = [...rows];
    updatedStandards[index].scale_description = value;
    onStandardsChange(updatedStandards);
  };
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
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                    placeholder="Descripción del criterio"
                  />
                </td>
                <td>
                  <Textarea
                  required
                    size="sm"
                    variant="plain"
                    minRows={3}
                    maxRows={5}
                    onChange={(e) =>
                      handleScaleDescriptionChange(index, e.target.value)
                    }
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

const data = [
  { title: 'Evaluación primer sprint ', description: 'Supongo que aquí puede ir una descripción o el nombre clave que pide en crear rúbrica.' },
  
];


export default function ViewCursoStudent() {
  const courseId = useParams().courseId;
  // console.log(courseId);
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

  const handleStandardsChange = (updatedStandards) => {
    setRubric((prevRubric) => ({
      ...prevRubric,
      standards: updatedStandards,
    }));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (value) => {
    setIsModalOpen(value);
  };

  const handleCreateRubric = (e) => {
    e.preventDefault();
    console.log(rubric);
    api
      .post(`api/create_rubric/${courseId}/`, rubric)
      .then((response) => {
        // console.log(response);
        setIsModalOpen(false);
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: `${response.message}`,
              severity: "success",
            },
          })
        );
      })
      .catch((error) => {
        console.error(error);
        setIsModalOpen(false);
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: `${error.message}`,
              severity: "danger",
            },
          })
        );
      });
  };

  
  const companeros = [
    { code: 1, name: 'Juan', last_name: 'Pérez' },
    { code: 2, name: 'María', last_name: 'Gómez' },
    { code: 3, name: 'Carlos', last_name: 'Rodríguez' },
    { code: 4, name: 'Ana', last_name: 'Martínez' },
  ];


  return (
    
    <React.Fragment>
      <Typography level="h2" component="h1">
        Evaluaciones disponibles
      </Typography>
      <Card
        variant="outlined"
        sx={{ width: '100%', p: 0 }}
        onClick={handleOpenModal}
      >
        <List
          sx={{
            py: 'var(--ListDivider-gap)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {data.map((item, index) => (
            <React.Fragment key={item.title}>
              <ListItem>
                <ListItemButton sx={{ gap: 2 }}>
                  <ListItemContent
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography fontWeight="md" fontSize="0.9rem">
                        {item.title}
                      </Typography>
                      <Typography level="body-sm" fontSize="0.8rem">
                        {item.description}
                      </Typography>
                    </Box>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
              {index !== data.length - 1 && <ListDivider />}
            </React.Fragment>
          ))}
        </List>
      </Card>
  
      <ModalFrame
        open={isModalOpen}
        onClose={handleCloseModal}
        ModalTitle="Evaluación"
      >
        <form onSubmit={handleCreateRubric}>
          <Stack
            component="article"
            direction="column"
            gap={2}
            sx={{
              width: '100%',
              height: '100%',
              overflow: 'auto',
              padding: 1,
              alignItems: 'center',
            }}
          >
            <Box
              component="header"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mt: 2,
                mb: 1,
                gap: 1,
                alignItems: 'center',
                flexWrap: 'wrap',
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <FormControl
                id="disabled-options-demo"
                sx={{ width: '100%', maxWidth: 300, margin: 0 }}
              >
                <FormLabel sx={{ mb: 1, alignSelf: 'center' }}>
                  Seleccione el compañero que desea evaluar
                </FormLabel>
                <Autocomplete
                  options={companeros}
                  size="sm"
                  isOptionEqualToValue={(option, value) => option.code === value.code}
                  placeholder="Compañero a evaluar"
                  getOptionDisabled={(option) => option === companeros[0]}
                  getOptionLabel={(option) => `${option.name} ${option.last_name}`}
                  onChange={(e, value) => {
                    setFormData({ ...formData, user_teacher: value.code });
                  }}
                  sx={{ width: '100%' }}
                  required
                />
              </FormControl>
            </Box>
  
            <FormControl sx={{ width: '100%', maxWidth: 600 }}>
              <FormLabel sx={{ alignSelf: 'flex-start' }}>
                Escribe un comentario:
              </FormLabel>
              <Textarea
                placeholder="Escribe aquí tu retroalimentación."
                minRows={2}
              />
              <FormHelperText>Escribe aquí la retroalimentación que verá tu compañero.</FormHelperText>
            </FormControl>
  
            <Box sx={{ display: 'flex', gap: 1, alignSelf: 'flex-end' }}>
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outlined"
                color="neutral"
              >
                Cancelar
              </Button>
              <Button type="submit">Enviar</Button>
            </Box>
          </Stack>
        </form>
      </ModalFrame>
    </React.Fragment>
  );
}
