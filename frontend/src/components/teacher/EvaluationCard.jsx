/* eslint-disable react/prop-types */
import CardContainer from "../CardContainer";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import interpretEvaluationState from "../../utils/interpretEvaluationState";

export default function EvaluationCard({ data, onClick }) {
  return (
    <CardContainer onClick={onClick} cursor>
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        gap={1}
        alignItems="baseline"
      >
        <Typography level="title-md">{data.name}</Typography>
        <Chip
          size="sm"
          color={
            data.estado === 2
              ? "success"
              : data.estado === 1
              ? "warning"
              : data.estado === 3
              ? "danger"
              : "primary"
          }
        >
          {interpretEvaluationState(data.estado)}
        </Chip>
      </Stack>
      <Typography level="body-xs">Rúbrica: {data.rubric}</Typography>
    </CardContainer>
  );
}
