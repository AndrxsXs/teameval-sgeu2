/* eslint-disable react/prop-types */
import { Fragment, useState } from "react";

import { Button, Box, Typography } from "@mui/joy";

import ModalFrame from "../components/ModalFrame";

export default function DisableUser(props) {
  const { user } = props;

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (value) => {
    setIsModalOpen(value);
  };
  return (
    <Fragment>
      <Button
        // disabled
        size="sm"
        variant="soft"
        color="danger"
        onClick={handleOpenModal}
      >
        Deshabilitar
      </Button>
      <ModalFrame
        open={isModalOpen}
        onClose={handleCloseModal}
        ModalTitle="Deshabilitar usuario"
      >
        <Typography
          id="nested-modal-description"
          textColor="text.tertiary"
          sx={{
            minWidth: "500px",
            minHeight: "50px",
          }}
        >
          Está a punto de deshabilitar a{" "}
          <strong>
            {user.name} {user.last_name}
          </strong>
          .
          {/* <br />
                    El usuario no podrá acceder a su cuenta.
                    <br />
                    Se puede {' '}<strong>
                    <Typography color='success'>
                        habilitar
                    </Typography>
                    </strong> {' '}
                    nuevamente en cualquier momento. */}
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
            loading={loading}
            onClick={() => {
              handleOpenModal;
              setLoading(true);
            }}
          >
            Deshabilitar
          </Button>

          <Button
            variant="outlined"
            color="neutral"
            onClick={() => handleCloseModal(false)}
          >
            Cancelar
          </Button>
        </Box>
      </ModalFrame>
    </Fragment>
  );
}
