import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Autocomplete from "@mui/joy/Autocomplete";
import { Box } from "@mui/joy";
import { Typography } from "@mui/joy";
import api from "../../../api";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function ViewCursoStudent() {
  const [companeros, setCompaneros] = useState([]);
  const userData = useOutletContext();
  const [selectedCompanero, setSelectedCompanero] = useState(null);

  const fetchCompaneros = async () => {
    const token = localStorage.getItem("ACCESS_TOKEN");

    await api
      .get(`api/group_members/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCompaneros(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        flexDirection: "column",
        mt: 2,
        mb: 1,
        gap: 1,
        alignItems: "start",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Typography level="h2" component="h1">
        Evaluación
      </Typography>

      <FormControl
        id="disabled-options-demo"
        sx={{ width: "100%", maxWidth: 300, margin: 0 }}
      >
        <FormLabel sx={{ mb: 2, alignSelf: "flex-start" }}>
          Seleccione el compañero que desea evaluar.
        </FormLabel>
        <Autocomplete
          options={companeros}
          onFocus={fetchCompaneros}
          size="sm"
          isOptionEqualToValue={(option, value) => option.code === value.code}
          placeholder="Compañero a evaluar"
          // getOptionDisabled={(option) => option === companeros[0]}
          getOptionLabel={(option) => `${option.name} ${option.last_name}`}
          onChange={(event, value) => setSelectedCompanero(value)}
          sx={{ width: "100%" }}
          required
        />
      </FormControl>
    </Box>
  );
}
