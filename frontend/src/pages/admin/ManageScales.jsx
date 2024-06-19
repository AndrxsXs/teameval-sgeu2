import { Fragment, useMemo, useState } from "react";

import GlobalCriteriaTable from "../../components/admin/GlobalCriteriaTable";

import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Skeleton from "@mui/joy/Skeleton";
// import FormControl from "@mui/joy/FormControl";
// import FormLabel from "@mui/joy/FormLabel";
// import Select from "@mui/joy/Select";
// import Option from "@mui/joy/Option";
// import FormHelperText from "@mui/joy/FormHelperText";
// import IconButton from "@mui/joy/IconButton";
// import CloseRounded from "@mui/icons-material/CloseRounded";

// import RubricList from "../../components/teacher/RubricList";
import ManageRubric from "../../components/teacher/ManageRubric";
// import eventDispatcher from "../../utils/eventDispacher";

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

export default function ManageScales() {
  const [editMode, setEditMode] = useState(false);
  const [rubricInfo, setRubricInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useMemo(() => {
    if (rubricInfo.id) {
      setEditMode(true);
      setLoading(false);
    } else {
      // eventDispatcher(
      //   "responseEvent",
      //   "No se ha encontrado la rúbrica",
      //   "danger"
      // );
    }
  }, [rubricInfo]);

  return (
    <Fragment>
      <Box
        component="header"
        sx={{
          display: "flex",
          mt: 2,
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Stack
          direction="column"
          sx={{
            maxWidth: "60%",
          }}
        >
          <Typography level="h2" component="h1">
            Escalas y criterios
          </Typography>

          <Typography level="body-md">
            Agregue y edite los criterios predeterminados que podrán usar los
            docentes en sus rúbricas.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <ManageRubric adminMode editMode={editMode} data={rubricInfo} />
        </Box>
      </Box>
      {/* <FormControl>
        <FormLabel>Escala</FormLabel>
        <Select
          required
          // action={action}
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
          sx={{
            width: "100%",
            maxWidth: "200px",
          }}
        >
          {Array.from(new Array(9)).map((_, index) => (
            <Option key={index} value={index + 2}>
              {index + 2}
            </Option>
          ))}
        </Select>
        <FormHelperText>
          Seleccione el límite superior de la escala de la rúbrica.
        </FormHelperText>
      </FormControl> */}
      <Stack component="section">
        {!loading && rubricInfo.id ? (
          <>
            <Typography level="title-md">Nombre: {rubricInfo.name}</Typography>
            <Typography level="body-sm">
              escala: {rubricInfo.scale.Lower_limit} -{" "}
              {rubricInfo.scale.Upper_limit}
            </Typography>
          </>
        ) : (
          <>
            <Skeleton
              variant="text"
              level="title-md"
              width={200}
              animation="wave"
            />
            <Skeleton
              variant="text"
              level="body-sm"
              width={100}
              animation="wave"
            />
          </>
        )}
      </Stack>
      <GlobalCriteriaTable
        setRubricInfo={setRubricInfo}
        headCells={headCells}
      />
      {/* <RubricList /> */}
    </Fragment>
  );
}
