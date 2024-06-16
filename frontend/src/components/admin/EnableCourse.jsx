/* eslint-disable react/prop-types */
import { Fragment, useState } from "react";

import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

import ModalFrame from "../ModalFrame";

import eventDispatcher from "../../utils/eventDispacher";

import api from "../../api";

import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";

export default function EnableCourse(props) {
  const { course } = props;

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (value) => {
    setIsModalOpen(value);
  };

  const handleEnableCourse = async () => {
    setLoading(true);

    await api
      .patch(`api/enable_course/${course.code}/`)
      .then((response) => {
        eventDispatcher("responseEvent", response);
        setLoading(false);
        window.dispatchEvent(new Event("course-enabled"));
        handleCloseModal(false);
      })
      .catch((error) => {
        eventDispatcher("responseEvent", error, "danger");
        setLoading(false);
        handleCloseModal(false);
      });
  };

  return (
    <Fragment>
      <Button
        // disabled
        size="sm"
        variant="outlined"
        color="success"
        onClick={handleOpenModal}
        startDecorator={<ArchiveRoundedIcon />}
      >
        Habilitar
      </Button>
      <ModalFrame
        open={isModalOpen}
        onClose={handleCloseModal}
        ModalTitle="Quitar estudiante del curso"
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
          Está a punto de habilitar al curso <strong>{course.name}</strong>.
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
              handleEnableCourse();
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
