/* eslint-disable react/prop-types */
import { useState } from "react";

import { Snackbar, Typography } from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

export default function SimpleSnackbar({ reason, description, onOpen }) {
    const [open, setOpen] = useState(onOpen);

    const titles = {
        "success": "Éxito",
        "warning": "Alerta",
        "error": "Error"
    }

    // console.log(reason, titles[reason], icons[reason])

    const title = titles[reason] || "info";

    return (
        <Snackbar
            size="sm"
            autoHideDuration={6000}
            variant="soft"
            color={reason}
            open={open}
            onClose={() => setOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            // startDecorator={icons[title] || <InfoRoundedIcon />}

            startDecorator={
                reason === 'success' ? <CheckCircleRoundedIcon />
                    : reason === 'danger' ? <ErrorRoundedIcon />
                        : reason === 'warning' ? <WarningRoundedIcon />
                            : <InfoRoundedIcon />
            }

            endDecorator={
                <IconButton
                    onClick={() => setOpen(false)}
                    variant="soft"
                    color={title}
                >
                    <CloseRoundedIcon />
                </IconButton>
            }
        >
            <Typography level="title-md">
                {title}
            </Typography>
            <Typography level="body-sm">
                {description}
            </Typography>
        </Snackbar >
    )
}