import * as React from 'react';
import { useState } from 'react';
import ModalFrame from '../ModalFrame';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import { AspectRatio } from '@mui/joy';

import Add from '@mui/icons-material/Add';

import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Avatar from '@mui/joy/Avatar'

export default function CreateAdmin() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = (value) => {
        setIsModalOpen(value);
    }

    // const [profilePicture, setProfilePicture] = React.useState(false);

    return (
        <React.Fragment>
            <Button
                color="primary"
                // size="sm"
                startDecorator={<Add />}
                onClick={handleOpenModal}
            >
                Nuevo administrador
            </Button>

            <ModalFrame
                open={isModalOpen}
                onClose={handleCloseModal}
                ModalTitle="Nuevo administrador"
            >
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleCloseModal;
                    }}
                >
                    <Box component='article'
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            alignItems: 'flex-end'

                        }}
                    >
                        <Stack direction="row"
                            spacing={3}
                            sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}>

                            {/* profile picture */}

                            <Stack direction="column" spacing={1}>
                                <AspectRatio
                                    ratio="1"
                                    maxHeight={200}
                                    sx={{
                                        // position: 'relative',
                                        flex: 1,
                                        minWidth: 120,
                                        borderRadius: '100%',
                                        // border: '1px solid',
                                        borderColor: 'divider',
                                        // backgroundImage: `url(${<PersonAddRoundedIcon />})`,
                                    }}
                                >

                                    <Avatar variant="outlined"
                                        // src={profilePicture}
                                        alt=""
                                        sx={{
                                            width: '',
                                            height: ''
                                        }} />

                                    {/* <img
                                                    // src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                                                    // srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                                                    //src={<PersonRoundedIcon />}
                                                    loading="lazy"
                                                    alt=""
                                                    style={{
                                                        border: 0,
                                                    }}
                                                />
                                                <PersonRoundedIcon
                                                    sx={{
                                                        transform: 'scale(50%)',
                                                        width: '100%',
                                                        height: '100%',
                                                        position: 'absolute',
                                                        zIndex: 2
                                                    }}
                                                /> */}
                                </AspectRatio>
                                {/* <PersonRoundedIcon sx={{ alignSelf: 'center', justifySelf: 'center', height: 'auto', width: '60%' }} /> */}
                                <IconButton
                                    aria-label="Subir una nueva imagen"
                                    size="sm"
                                    variant="outlined"
                                    color="neutral"
                                    sx={{
                                        bgcolor: 'background.body',
                                        position: 'absolute',
                                        zIndex: 2,
                                        borderRadius: '50%',
                                        left: 100,
                                        top: 150,
                                        boxShadow: 'sm',
                                    }}
                                >
                                    {/* <Input type="file"> */}
                                    <EditRoundedIcon />
                                    {/* </Input> */}
                                </IconButton>
                            </Stack>

                            {/* end profile picture */}

                            <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                <Stack component='section'
                                    sx={{ flexDirection: 'row', gap: 2, alignItems: 'flex-end' }}
                                >
                                    <FormControl
                                    //sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}

                                    >
                                        <FormLabel>Nombre</FormLabel>
                                        <Input size="sm" placeholder="Nombres" type='text' required />
                                    </FormControl>
                                    <FormControl>
                                        <Input size="sm" placeholder="Apellidos" type='text' required />
                                    </FormControl>
                                </Stack>
                                <FormControl>
                                    <FormLabel>Correo electrónico</FormLabel>
                                    <Input
                                        size="sm"
                                        type="email"
                                        startDecorator={<EmailRoundedIcon />}
                                        placeholder="su.correo@institución.com"
                                        required
                                    //defaultValue="siriwatk@test.com"
                                    //sx={{ flexGrow: 1 }}
                                    />
                                </FormControl>
                                <Stack component='section'
                                    sx={{ flexDirection: 'row', gap: 2, }}
                                >
                                    <FormControl>
                                        <FormLabel>Cédula</FormLabel>
                                        <Input size="sm" placeholder="Ingrese el código" type='number' required />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Teléfono (Opcional)</FormLabel>
                                        <Input size="sm" placeholder="Ingrese el teléfono" type="tel" />
                                    </FormControl>
                                </Stack>
                            </Stack>

                        </Stack>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                            }}
                        >
                            <Button
                                onClick={() => setIsModalOpen(false)}
                                variant='outlined'
                                color='neutral'
                            >Cancelar</Button>
                            <Button type="submit">Crear</Button>
                        </Box>
                    </Box>
                </form>
            </ModalFrame>

        </React.Fragment>
    );
}
