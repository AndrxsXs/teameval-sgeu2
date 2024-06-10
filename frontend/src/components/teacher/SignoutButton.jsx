import { Fragment, useState } from "react";
import { Button, Box, Typography } from "@mui/joy";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ModalFrame from "../../components/ModalFrame";

export default function SignoutButton() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Fragment>
      <Button
        className="cerrar-sesión-button"
        variant="plain"
        color="neutral"
        onClick={handleOpenModal}
        startDecorator={<LogoutRoundedIcon />}
        sx={{
          position: "absolute",
          bottom: "16px",
          right: "16px",
        }}
      >
        Cerrar sesión
      </Button>

      <ModalFrame
        open={isModalOpen}
        onClose={handleCloseModal}
        ModalTitle="Cerrar sesión"
      >
        <Typography
          id="nested-modal-description"
          textColor="text.tertiary"
          sx={{
            minWidth: "500px",
          }}
        >
          Está a punto de cerrar sesión.
        </Typography>
        <Box
          sx={{
            mt: 1,
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column", sm: "row-reverse" },
          }}
        >
          <Button
            variant="solid"
            color="danger"
            component="a"
            href="/logout"
            loading={loading}
            onClick={() => {
              setLoading(true);
            }}
          >
            Salir
          </Button>

          <Button
            variant="outlined"
            color="neutral"
            onClick={() => setIsModalOpen(false)}
          >
            Cancelar
          </Button>
        </Box>
      </ModalFrame>
    </Fragment>
  );
}
