/* eslint-disable react/prop-types */
import { Fragment, useState } from "react";

import { Button, Box, Typography } from "@mui/joy";

import ModalFrame from "../components/ModalFrame";

import api from "../api";
import { ACCESS_TOKEN } from "../constants";

export default function EnableUser(props) {
  const { user, endpoint } = props;

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (value) => {
    setIsModalOpen(value);
  };

  const handleEnableUser = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    // console.log(user.code);
    // console.log(endpoint);
    await api
      .patch(
        `${endpoint}?user_code=${user.code}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        window.dispatchEvent(
          // console.log("Evento de respuesta: ", response),
          new CustomEvent("responseEvent", {
            detail: {
              message: `${response.data.message}`,
              severity: "success",
            },
          })
        );
        setLoading(false);
        handleCloseModal(false);
        window.dispatchEvent(new Event("user-disabled"));
      })
      .catch((error) => {
        // console.log("Error: ", error.response.data.error);
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: `${error.response.data.error}`,
              severity: "danger",
            },
          })
        );
        setLoading(false);
        handleCloseModal(false);
      });
  };

  return (
    <Fragment>
      <Button
        // disabled
        size="sm"
        variant="plain"
        color="success"
        onClick={handleOpenModal}
      >
        Habilitar
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
          Está a punto de habilitar a{" "}
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
            color="success"
            loading={loading}
            onClick={() => {
              handleOpenModal;
              setLoading(true);
              handleEnableUser();
            }}
          >
            Habilitar
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
