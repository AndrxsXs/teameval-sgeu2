/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";

import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Typography from "@mui/joy/Typography";
import { Link as JoyLink } from "@mui/joy";
import Skeleton from "@mui/joy/Skeleton";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

export default function TeacherBreadcrumbs(props) {
  const { HomeRoute, CourseLabel, CourseRoute, loading } = props;
  const location = useLocation();
  // console.log(loading);
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Breadcrumbs
        size="sm"
        aria-label="breadcrumbs"
        separator={<ChevronRightRoundedIcon fontSize="sm" />}
        sx={{ pl: 0 }}
      >
        <Link
          to={`/${HomeRoute}`}
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <JoyLink
            component="span"
            underline="hover"
            color="neutral"
            fontSize={12}
            fontWeight={500}
          >
            <Stack direction="row" gap={1}>
              <HomeRoundedIcon />
              <JoyLink
                component="span"
                underline="hover"
                color="neutral"
                fontSize={12}
                fontWeight={500}
              >
                Mis cursos
              </JoyLink>
            </Stack>
          </JoyLink>
        </Link>
        <JoyLink
          component="span"
          underline="hover"
          color="neutral"
          fontSize={12}
          fontWeight={500}
        >
          <Link
            to={CourseRoute}
            style={{
              textDecoration: "inherit",
              color: "inherit",
            }}
          >
            {!loading ? (
              CourseLabel
            ) : (
              <Skeleton
                variant="text"
                level="body-xs"
                loading
                sx={{
                  width: 100,
                }}
              />
            )}
          </Link>
        </JoyLink>
        <Typography color="primary" fontWeight={500} fontSize={12}>
          {location.pathname.split("/")[4]
            ? location.pathname
                .split("/")[4]
                .charAt(0)
                .toUpperCase()
                .concat(location.pathname.split("/")[4].slice(1))
            : "Curso"}
        </Typography>
      </Breadcrumbs>
    </Box>
  );
}
