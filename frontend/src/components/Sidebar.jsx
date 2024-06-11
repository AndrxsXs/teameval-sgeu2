/* eslint-disable react/prop-types */
import { Link, useLocation, matchPath, useMatch } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import ProfileInfo from "./ProfileInfo";
// import DropdownMenu from "./DropdownMenu";

import "../styles/components/Sidebar.css";

import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ListSubheader from "@mui/joy/ListSubheader";

import ColorSchemeToggle from "./ColorSchemeToggle";

const MenuItem = ({ icon, text, route, isSelected }) => (
  <ListItem>
    <Link
      to={route}
      style={{
        textDecoration: "none",
        color: "inherit",
        backgroundColor: "inherit",
        borderRadius: "inherit",
        width: "100%",
      }}
    >
      <ListItemButton selected={isSelected}>
        {icon}
        <ListItemContent>
          <Typography level="title-sm">{text}</Typography>
        </ListItemContent>
      </ListItemButton>
    </Link>
  </ListItem>
);

export default function Sidebar(props) {
  const { userData } = props;

  const {
    firstHeader,
    menuItems,
    settingsRoute,
    // showDropdownMenu,
    // dropdownMenuProps,
    // dropdownMenuPosition,
  } = props;

  const location = useLocation();
  const teacherRouteMatch = useMatch("/profesor/curso/:courseId/*");
  const adminRouteMatch = useMatch("admin/*");
  const studentRouteMatch = useMatch("estudiante/*");

  return (
    <Sheet
      component="aside"
      className="Sidebar"
      sx={{
        boxShadow: "md",
        "&:hover": {
          boxShadow: "none",
        },
        transition: "box-shadow 0.3s",
        position: "sticky",
        height: "100dvh",
        // width: 'var(--Sidebar-width)',
        // width: 'max-content',
        width: "100%",
        maxWidth: "300px",
        top: 0,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        component="header"
        className="logo-header"
        sx={{
          display: "flex",
          gap: 1,
          p: "16px",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <TopNavbar session />
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>
      <Box
        component="nav"
        sx={{
          minHeight: 0,
          p: "16px",
          pt: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
          pb: 0,
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          <ListSubheader sx={{ letterSpacing: "2px", fontWeight: "800" }}>
            {firstHeader}
          </ListSubheader>
          {menuItems &&
            menuItems.map(({ text, route, icon }, index) => {
              let isSelected;

              if (teacherRouteMatch) {
                isSelected = matchPath(
                  {
                    path: `${teacherRouteMatch.pathnameBase}${
                      route.split(".")[1]
                    }`,
                    end: true,
                  },
                  location.pathname
                );
              } else if (adminRouteMatch) {
                isSelected = matchPath(
                  {
                    path: `${adminRouteMatch.pathnameBase}${
                      route.split(".")[1]
                    }`,
                    end: true,
                  },
                  location.pathname
                );
              } else if (studentRouteMatch) {
                isSelected = matchPath(
                  {
                    path: `${studentRouteMatch.pathnameBase}${
                      route.split(".")[1]
                    }`,
                    end: true,
                  },
                  location.pathname
                );
              }

              return (
                <MenuItem
                  key={index}
                  icon={icon}
                  text={text}
                  route={route}
                  isSelected={isSelected !== null}
                />
              );
            })}
        </List>

        {/* <List
          size="sm"
          sx={{
            mt: "auto",
            flexGrow: 0,
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
            "--List-gap": "8px",
            mb: 2,
          }}
        >
          <ListSubheader sx={{ letterSpacing: "2px", fontWeight: "800" }}>
            Sistema
          </ListSubheader>
          <ListItem>
            <ListItemButton
              selected={location.pathname === settingsRoute}
              disabled
            >
              <SettingsRoundedIcon />
              <ListItemContent>
                <Link to={settingsRoute}>
                  <Typography
                    level="title-sm"
                    sx={{
                      color: "var(--joy-palette-neutral-400, #9FA6AD)",
                    }}
                  >
                    Ajustes
                  </Typography>
                </Link>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        </List> */}
      </Box>
      <Divider
        sx={{
          my: "-16px",
        }}
      />
      <ProfileInfo userData={userData} />
    </Sheet>
  );
}
