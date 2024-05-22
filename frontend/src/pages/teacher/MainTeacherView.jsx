import { Link, useNavigate } from 'react-router-dom';
import CardCurso from "../../components/teacher/CardCurso"
import TopNavbar from "../../components/TopNavbar"
import Box from '@mui/material/Box'
import "../../styles/pages/teacher/MainTeacherView.css"
import fondo from '../../assets/Fondo.png'
import fondoCard from '../../assets/FondoCardDefecto.png'
import fondoCiber from '../../assets/FondoCiber.png'
import { Button } from '@mui/joy';


import { Fragment } from 'react';
import { useState } from 'react';
import IconButton from '@mui/joy/IconButton';
import { Typography } from '@mui/joy';


import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ModalFrame from '../../components/ModalFrame';


export default function MainTeacherView() {

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = (value) => {
        setIsModalOpen(value);
    }

    //const navigate = useNavigate();

    return (
        <Box
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, justifyContent: 'center' }}
        >
            <TopNavbar />

            <Box className="contenedor"
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column', // Cambia a columna para que "Mis cursos" esté arriba
                    minWidth: 0,
                    height: '100%',
                    gap: 2,
                    justifyContent: 'center',
                    alignItems: 'flex-start', // Alinea a la izquierda
                }}
            >
                <Typography level="h2" component="h1" sx={{ marginBottom: '30px', marginTop: '20px' }} >
                    Mis cursos
                </Typography>

                <Box
                    className="contenedor-curso"
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        minWidth: 0,
                        height: '100%',
                        alignSelf: 'center',
                        gap: 2,
                        justifyContent: 'center',
                    }}>

                    <Link to="curso"> <CardCurso name="Desarrollo de software" src={fondoCard} /></Link>
                    <Link to="curso"> <CardCurso name="Base de datos" src={fondo} /></Link>
                    <Link to="curso"> <CardCurso name="Ciberseguridad" src={fondoCiber} /></Link>

                </Box>

                <Fragment>


                    <Button
                        className="cerrar-sesión-button"
                        variant="plain"
                        color="neutral"
                        onClick={handleOpenModal}
                        endDecorator={<LogoutRoundedIcon />}
                        sx={{
                            position: 'absolute',
                            bottom: '16px',
                            right: '16px'
                        }}
                    >
                        Cerrar sesión
                    </Button>

                    <ModalFrame
                        open={isModalOpen}
                        onClose={handleCloseModal}
                        ModalTitle="Cerrar sesión"
                    >
                        <Typography id="nested-modal-description" textColor="text.tertiary"
                            sx={{
                                minWidth: '500px'
                            }}
                        >
                            Está a punto de cerrar sesión.
                        </Typography>
                        <Box
                            sx={{
                                mt: 1,
                                display: 'flex',
                                gap: 1,
                                flexDirection: { xs: 'column', sm: 'row-reverse' },
                            }}
                        >

                            <Button variant="solid"
                                color="danger"
                                component="a"
                                href='/logout'
                                loading={loading}
                                onClick={() => { handleOpenModal; setLoading(true) }}>
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

            </Box>
        </Box>
    )
}