/* eslint-disable react/prop-types */
import { useState } from "react";

import { Snackbar, Typography } from "@mui/joy";

export default function SimpleSnackbar({ reason, description, onOpen }) {
    const [open, setOpen] = useState(onOpen);

    const titles = {
        "Éxito": "success",
        "Alerta": "warning",
        "Error": "danger"
    };

    const title = titles[reason] || "info";

    return (
        <Snackbar
            autoHideDuration={4000}
            variant="solid"
            color={title}
            open={open}
            onClose={() => setOpen(false)}
        >
            <Typography level="title-md">
                {reason}
            </Typography>
            <Typography level="body-sm">
                {description}
            </Typography>
        </Snackbar>
    )
}