import {
    useState,
    Fragment,
    useEffect,

} from 'react';
import api from '../../api';
import ModalFrame from '../ModalFrame';

import ImportStudents from './ImportStudents';

import {
    Select,
    Option,
    Button,
    FormControl,
    FormLabel,
    Input,
    IconButton,
    Box,
    Stack,
    AspectRatio,
    Avatar,
    Autocomplete,
} from '@mui/joy';

import {
    Add,
} from '@mui/icons-material';

import EditRoundedIcon from '@mui/icons-material/EditRounded';

export default function CreateCourse() {

    const [academicPeriod, setAcademicPeriod] = useState('');
    const [year, setYear] = useState('');
    const [cycle, setCycle] = useState('');

    const [loading, setLoading] = useState(false);
    const route = "api/create_course/"
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        academic_period: academicPeriod,
        user_teacher: ''
    });

    const testTeachers = [
        {
            code: 1,
            name: 'Juan',
            last_name: 'Pérez',
            email: 'juan@mail.com'
        },
        {
            code: 2,
            name: 'María',
            last_name: 'González',
            email: 'maria@mail.com'
        },
    ]

    useEffect(() => {
        if (year && cycle) {
            setAcademicPeriod(`${year}-${cycle}`);
        }
    }, [year, cycle]);

    const handleSubmit = async (event) => {
        // console.log(formData);
        setLoading(true);
        event.preventDefault();

        const token = localStorage.getItem('ACCESS_TOKEN');

        try {
            const response = await api.post(route, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                const data = await response.json();
                console.log(data);
                // Emitir el evento 'userCreated' después de crear un nuevo usuario
                window.dispatchEvent(new Event('courseCreated'));
            } else {
                console.error('Error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }

        setLoading(false);
        handleCloseModal(false);
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
        <Fragment>
            <Button
                color="primary"
                // size="sm"
                startDecorator={<Add />}
                onClick={handleOpenModal}
            >
                Nuevo curso
            </Button>

            <ModalFrame
                open={isModalOpen}
                onClose={handleCloseModal}
                ModalTitle="Nuevo curso"
            >
                <form
                    onSubmit={handleSubmit}
                >
                    <Box component='article'
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            alignItems: 'flex-start'

                        }}
                    >
                        <Stack direction="row"
                            // spacing={3}
                            sx={{ display: 'flex', my: 1 }}>

                            {/* profile picture */}

                            <Stack direction="column" spacing={1}
                                sx={{
                                    display: { sm: 'none', md: 'none' },
                                }}
                            >
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

                                </AspectRatio>
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
                                        left: 110,
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

                            <Stack component='section' spacing={2} sx={{ flexGrow: 1, }}>
                                <Stack component='section'
                                    sx={{ flexDirection: 'row', gap: 2, alignItems: 'flex-end' }}
                                >
                                    <FormControl
                                    //sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}

                                    >
                                        <FormLabel>Nombre</FormLabel>
                                        <Input size="sm" placeholder="Nombre del curso" type='text'
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Código</FormLabel>
                                        <Input size="sm" placeholder="Código del curso"
                                            value={formData.code}
                                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                                            type='text' required />
                                    </FormControl>
                                </Stack>
                                <Stack component='section'
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        // flexDirection: 'row',
                                        gap: 2,
                                        maxWidth: '100%'
                                    }}
                                >
                                    <FormControl
                                        sx={{ width: '100%' }}
                                    >
                                        <FormLabel>Docente asignado</FormLabel>
                                        {/* <Input size="sm" placeholder="Ingrese el código"
                                            value={formData.code}
                                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                                            type='number' required /> */}
                                        {/* <Select
                                            size="sm"
                                            placeholder="Seleccione un docente"
                                        >
                                            <Option value="1">Docente 1</Option>
                                        </Select> */}

                                        <Autocomplete
                                            size='sm'
                                            options={testTeachers}
                                            isOptionEqualToValue={(option, value) => option.code === value.code}
                                            // getOptionValue={(option) => option.code}
                                            placeholder='Seleccione un docente'
                                            getOptionLabel={(option) => `${option.name} ${option.last_name}`}
                                            sx={{
                                                width: '92%'
                                            }}
                                        />

                                    </FormControl>
                                    <Box
                                        sx={{

                                        }}
                                    >
                                        <FormLabel
                                            sx={{
                                                marginBottom: '6px'
                                            }}
                                        >Periodo académico</FormLabel>
                                        {/* <Input size="sm" placeholder="Ingrese el teléfono"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            type="tel" /> */}
                                        <Box
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: 1,
                                                maxWidth: '100%'
                                            }}
                                        >
                                            <Select
                                                size="sm"
                                                placeholder="Año"
                                                onChange={e => setYear(e.target.value)}
                                            >
                                                <Option value="1">2024</Option>
                                            </Select>
                                            <Select
                                                size="sm"
                                                placeholder="Ciclo"
                                                onChange={e => setCycle(e.target.value)}
                                            >
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                            </Select>
                                        </Box>

                                    </Box>
                                </Stack>
                            </Stack>
                        </Stack>
                        <ImportStudents />
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                alignSelf: 'flex-end',
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
        </Fragment>
    );
}
