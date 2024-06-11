/* eslint-disable react/prop-types */
import Box from "@mui/joy/Box";
import Checkbox from "@mui/joy/Checkbox";
import Link from "@mui/joy/Link";
import { visuallyHidden } from "@mui/utils";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
    showCheckbox,
    showActions,
    showEmptyColumn,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <thead>
      <tr>
        {showEmptyColumn ? (
          <th style={{ width: 40 }} aria-label="empty" />
        ) : null}
        {showCheckbox ? (
          <th>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              slotProps={{
                input: {
                  "aria-label": "select all desserts",
                },
              }}
              sx={{ verticalAlign: "sub" }}
            />
          </th>
        ) : null}
        {headCells.map((headCell) => {
          const active = orderBy === headCell.id;
          return (
            <th
              key={headCell.id}
              aria-sort={
                active
                  ? { asc: "ascending", desc: "descending" }[order]
                  : undefined
              }
            >
              <Link
                underline="none"
                color="neutral"
                textColor={active ? "primary.plainColor" : "text.secondary"}
                component="button"
                onClick={createSortHandler(headCell.id)}
                fontWeight="lg"
                startDecorator={
                  headCell.numeric ? (
                    <ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />
                  ) : null
                }
                endDecorator={
                  !headCell.numeric ? (
                    <ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />
                  ) : null
                }
                sx={{
                  "& svg": {
                    transition: "0.2s",
                    transform:
                      active && order === "desc"
                        ? "rotate(0deg)"
                        : "rotate(180deg)",
                  },
                  "&:hover": { "& svg": { opacity: 1 } },
                }}
              >
                {headCell.label}
                {active ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "ordenado de forma descendente"
                      : "ordenado de forma ascendente"}
                  </Box>
                ) : null}
              </Link>
            </th>
          );
        })}
        {showActions ? <th>Acciones</th> : null}
      </tr>
    </thead>
  );
}
