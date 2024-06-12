/* eslint-disable react/prop-types */
import { Fragment, useState } from "react";

import { ACCESS_TOKEN } from "../../constants";

import { Button, Box, Typography } from "@mui/joy";

import ModalFrame from "../ModalFrame";

import api from "../../api";

export default function DisableStudent(props) {
  const { user, endpoint } = props;

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (value) => {
    setIsModalOpen(value);
  };

  const handleDisableUser = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    await api
      .post(
        `${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            user_code: user.code,
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
        window.dispatchEvent(new Event("user-disabled"));
        handleCloseModal(false);
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
            maxWidth: "300px",
          }}
        >
          Está a punto de deshabilitar a{" "}
          <strong>
            {user.name} {user.last_name}
          </strong>
          . El usuario no podrá acceder a su cuenta y desaparecerá de este curso y de algún grupo en el que esté.
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
              handleDisableUser();
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
