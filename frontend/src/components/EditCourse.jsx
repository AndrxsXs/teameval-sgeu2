/* eslint-disable react/prop-types */
import * as React from "react";
// import api from '../../api';
import { useState } from "react";
import ModalFrame from "./ModalFrame";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import { AspectRatio } from "@mui/joy";
// import Add from '@mui/icons-material/Add';
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Avatar from "@mui/joy/Avatar";

export default function EditCourse(props) {
  const { course } = props;
  const [loading, setLoading] = useState(false);

  // const route = "api/edit_course/"

  const [formData, setFormData] = useState({
    code: course.code,
    name: course.name,
    teacher: course.teacher,
    academic_period: course.academic_period,
    students: course.students,
    // last_name: course.last_name,
    // email: course.email,
    // phone: course.phone
  });

  const handleSubmit = async (event) => {
    // console.log(formData);
    setLoading(true);
    event.preventDefault();

    // const token = localStorage.getItem('ACCESS_TOKEN');

    // try {
    //     const response = await api.post(route, formData, {
    //         headers: {
    //             'Authorization': `Bearer ${token}`,
    //         },
    //     });

    //     if (response.status === 201) {
    //         const data = await response.json();
    //         console.log(data);
    //         // Emitir el evento 'userCreated' después de crear un nuevo curso
    //         window.dispatchEvent(new Event('userCreated'));
    //     } else {
    //         console.error('Error:', response.status, response.statusText);
    //     }
    // } catch (error) {
    //     console.error('Error:', error);
    // }

    setLoading(false);
    handleCloseModal(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (value) => {
    setIsModalOpen(value);
  };

  // const [profilePicture, setProfilePicture] = React.useState(false);

  return (
    <React.Fragment>
      <Button
        disabled
        size="sm"
        variant="plain"
        color="neutral"
        onClick={handleOpenModal}
      >
        Editar
      </Button>

      <ModalFrame
        open={isModalOpen}
        onClose={handleCloseModal}
        ModalTitle="Editar curso"
      >
        <form onSubmit={handleSubmit}>
          <Box
            component="article"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "flex-end",
            }}
          >
            <Stack direction="row" spacing={3} sx={{ display: "flex", my: 1 }}>
              {/* profile picture */}

              <Stack
                direction="column"
                spacing={1}
                sx={{
                  display: { sm: "none", md: "none" },
                }}
              >
                <AspectRatio
                  ratio="1"
                  maxHeight={200}
                  sx={{
                    // position: 'relative',
                    flex: 1,
                    minWidth: 120,
                    borderRadius: "100%",
                    // border: '1px solid',
                    borderColor: "divider",
                    // backgroundImage: `url(${<PersonAddRoundedIcon />})`,
                  }}
                >
                  <Avatar
                    variant="outlined"
                    // src={profilePicture}
                    alt=""
                    sx={{
                      width: "",
                      height: "",
                    }}
                  />
                </AspectRatio>
                <IconButton
                  aria-label="Subir una nueva imagen"
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  sx={{
                    bgcolor: "background.body",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    left: 110,
                    top: 150,
                    boxShadow: "sm",
                  }}
                >
                  {/* <Input type="file"> */}
                  <EditRoundedIcon />
                  {/* </Input> */}
                </IconButton>
              </Stack>

              {/* end profile picture */}
            </Stack>
            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outlined"
                color="neutral"
              >
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                Guardar
              </Button>
            </Box>
          </Box>
        </form>
      </ModalFrame>
    </React.Fragment>
  );
}
