/* eslint-disable react/prop-types */
import { Fragment } from "react";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";

export default function CardContainer({ children, cursor, onClick }) {
  return (
    <Fragment>
      <Card
        onClick={onClick}
        sx={{
          width: 300,
          height: 150,
          borderRadius: "sm",
          boxShadow: "sm",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 2,
          transition: "box-shadow 0.3s",
          "&:hover": {
            boxShadow: "none",
          },
          overflow: "hidden",
          cursor: cursor ? "pointer" : "default",
        }}
      >
        <CardContent>{children}</CardContent>
      </Card>
    </Fragment>
  );
}
