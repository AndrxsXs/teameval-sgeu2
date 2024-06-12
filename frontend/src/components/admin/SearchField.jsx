/* eslint-disable react/prop-types */
import { useRef } from "react";
import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";

import SearchIcon from "@mui/icons-material/Search";

function DebounceInput(props) {
  const { handleDebounce, debounceTimeout, ...rest } = props;

  const timerRef = useRef();

  const handleChange = (event) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleDebounce(event.target.value);
    }, debounceTimeout);
  };

  return <Input {...rest} onChange={handleChange} />;
}

export default function SearchField(props) {
  const { onSearchChange } = props;
  // const [searchValue, setSearchValue] = useState("");

  const handleDebounce = (value) => {
    // setSearchValue(value);
    onSearchChange(value);
  };
  return (
    <Box
      component="section"
      className="search-field"
      sx={{
        alignSelf: "flex-start",
        minWidth: "50%",
        borderRadius: "sm",
        py: 2,
        display: { xs: "none", sm: "flex" },
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 1.5,
        "& > *": {
          minWidth: { xs: "120px", md: "160px" },
        },
      }}
    >
      <FormControl sx={{ flex: 1 }} size="sm">
        <FormLabel>Buscar usuario</FormLabel>
        <DebounceInput
          size="sm"
          placeholder="Cédula, nombre o correo electrónico"
          startDecorator={<SearchIcon />}
          debounceTimeout={500}
          handleDebounce={handleDebounce}
        />
      </FormControl>
    </Box>
  );
}
