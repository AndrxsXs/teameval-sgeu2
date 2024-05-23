import * as React from 'react';
import api from '../../api';
import { useState } from 'react';
import ModalFrame from '../ModalFrame';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
// import IconButton from '@mui/joy/IconButton';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
// import { AspectRatio } from '@mui/joy';
import Add from '@mui/icons-material/Add';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';


export default function CreateStudent() {

    const [loading, setLoading] = useState(false);

    const route = "api/register_student/"

    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        code: '',
        email: '',
    });

    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();

        const token = localStorage.getItem('ACCESS_TOKEN');

        const response = await api.post(route, formData, {
            headers: {
                'Authorization': `Bearer ${token}` // Aquí es donde se agrega el token a los headers
            }
        });

        if (response.ok) {
            const data = await response.data;
            // console.log(data);
            // Aquí puedes manejar la respuesta de la API
            window.dispatchEvent(
                new CustomEvent('responseEvent', {
                    detail: {
                        message: `${data.message}`,
                        severity: 'danger',
                    },
                })
            );
        } else {
            // console.error('Error:', response.status, response.statusText);
            window.dispatchEvent(
                new CustomEvent('responseEvent', {
                    detail: {
                        message: `${response.statusText}`,
                        severity: 'danger',
                    },
                })
            );
        }
        setLoading(false);
    };

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
                variant="outlined"
                // size="sm"
                startDecorator={<Add />}
                onClick={handleOpenModal}
            >
                Añadir otro estudiante
            </Button>



            <ModalFrame
                open={isModalOpen}
                onClose={handleCloseModal}
                ModalTitle="Añadir otro estudiante al curso"
            >
                <form
                    onSubmit={handleSubmit}
                >
                    <Box component='article'
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            alignItems: 'flex-end'

                        }}
                    >

                        <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}>
                            <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                <Stack component='section' sx={{ flexDirection: 'row', gap: 2, alignItems: 'flex-end' }}>
                                    <FormControl sx={{ width: '300px' }}>
                                        <FormLabel>Nombre</FormLabel>
                                        <Input
                                            size="sm"
                                            placeholder="Nombres"
                                            type='text'
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </FormControl>
                                    <FormControl sx={{ width: '300px' }}>
                                        <FormLabel>Apellidos</FormLabel>
                                        <Input
                                            size="sm"
                                            placeholder="Apellidos"
                                            value={formData.last_name}
                                            onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                            type='text'
                                            required
                                        />
                                    </FormControl>
                                </Stack>
                                <Stack component='section' sx={{ flexDirection: 'row', gap: 2, alignItems: 'flex-end' }}>
                                    <FormControl sx={{ width: '300px' }}>
                                        <FormLabel>Correo electrónico</FormLabel>
                                        <Input
                                            size="sm"
                                            type="email"
                                            startDecorator={<EmailRoundedIcon />}
                                            placeholder="su.correo@institución.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />

                                    </FormControl>
                                    <FormControl sx={{ width: '300px' }}>
                                        <FormLabel>Código</FormLabel>
                                        <Input
                                            size="sm"
                                            placeholder="Ingrese el código"
                                            value={formData.code}
                                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                                            type='number'
                                            required
                                        />
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
                            <Button type="submit"
                                loading={loading}
                            >Crear</Button>
                        </Box>
                    </Box>
                </form>
            </ModalFrame>

        </React.Fragment>
    );
}
