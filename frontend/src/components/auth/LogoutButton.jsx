import { Fragment } from 'react';
import { useState } from 'react';
import ModalFrame from '../ModalFrame';

import IconButton from '@mui/joy/IconButton';
import { Button } from '@mui/joy';
import { Typography } from '@mui/joy';
import Box from '@mui/joy/Box';

import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

export default function LogoutButton() {

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = (value) => {
        setIsModalOpen(value);
    }

    return (
        <Fragment>
            <IconButton size="sm" variant="plain" color="neutral"
                //component="a" href="/logout"
                onClick={handleOpenModal}
            >
                <LogoutRoundedIcon />
            </IconButton>
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

    )
}