import {
    useState,
    Fragment,
    useEffect,

} from 'react';
import api from '../../api';
import ModalFrame from '../ModalFrame';

import ImportStudents from './ImportStudents';

import {
    Box,
    Stack,
    FormControl,
    FormLabel,
    Select,
    Option,
    Button,
    Input,
    Autocomplete,
} from '@mui/joy';

import {
    Add,
} from '@mui/icons-material';


export default function CreateCourse() {

    const [loading, setLoading] = useState(false);
    const route = "api/create_course/"

    const [year, setYear] = useState(undefined);
    const [cycle, setCycle] = useState(undefined);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        academic_period: '',
        user_teacher: '',
    });

    const [teachers, setTeachers] = useState([]);

    const fetchTeachers = async () => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        try {
            const response = await api.get('api/user_list/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    role: 2
                }
            });
            setTeachers(response.data);
            // console.log('Docentes:', response.data);
        } catch (error) {
            console.error('Error obteniendo datos de docentes:', error);
        }
    };

    useEffect(() => {
        if (year && cycle) {
            const newAcademicPeriod = `${year}-${cycle}`;
            setFormData((prevFormData) => ({
                ...prevFormData,
                academic_period: newAcademicPeriod,
            }));
            // console.log('Periodo académico:', newAcademicPeriod);
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
                const data = await response.data
                console.log(data);

                // Emitir el evento 'courseCreated' después de crear un nuevo usuario
                window.dispatchEvent(new Event('courseCreated'));
                window.dispatchEvent(
                    new CustomEvent('responseEvent', {
                        detail: {
                            message: 'Curso creado correctamente',
                            severity: 'success',
                        },
                    })
                );
                setFormData({
                    code: '',
                    name: '',
                    academic_period: '',
                    user_teacher: '',
                });
            } else {
                window.dispatchEvent(
                    new CustomEvent('responseEvent', {
                        detail: {
                            message: `${response.statusText}`,
                            severity: 'danger',
                        },
                    })
                );
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
                            alignItems: 'flex-start',
                            minWidth: '500px',
                        }}
                    >
                        <Stack direction="row"
                            // spacing={3}
                            sx={{ display: 'flex', my: 1, width: '100%' }}>

                            <Stack component='section' spacing={2} sx={{ flexGrow: 1, width: '100%' }}>
                                <Stack component='section'
                                    direction='row'
                                    gap={2}
                                    alignItems='flex-end'
                                    justifyContent='center'

                                    sx={{
                                        width: '100%',
                                    }}
                                >
                                    <FormControl
                                        //sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                        sx={{
                                            width: '48%',
                                        }}
                                    >
                                        <FormLabel>Nombre</FormLabel>
                                        <Input size="sm" placeholder="Nombre del curso" type='text'
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required />
                                    </FormControl>
                                    <FormControl
                                        sx={{
                                            width: '50%',
                                        }}
                                    >
                                        <FormLabel>Código</FormLabel>
                                        <Input size="sm" placeholder="Código del curso"
                                            value={formData.code}
                                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                                            type='text'
                                            required />
                                    </FormControl>
                                </Stack>
                                <Stack component='section'
                                    direction='row'
                                    gap={2}
                                    alignItems='flex-end'
                                    justifyContent='space-between'
                                    sx={{
                                        width: '100%'
                                    }}

                                // sx={{
                                //     display: 'grid',
                                //     gridTemplateColumns: '1fr 1fr',
                                //     // flexDirection: 'row',
                                //     gap: 2,
                                //     maxWidth: '100%', justifyContent: 'center'
                                // }}
                                >
                                    <FormControl
                                        sx={{ width: '48%', justifyContent: 'space-between' }}
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
                                            options={teachers}
                                            onFocus={fetchTeachers}
                                            isOptionEqualToValue={(option, value) => option.code === value.code}
                                            // getOptionValue={(option) => option.code}
                                            placeholder='Seleccione un docente'
                                            getOptionLabel={(option) => `${option.name} ${option.last_name}`}
                                            onChange={(e, value) => { setFormData({ ...formData, user_teacher: value.code }) }}
                                            required
                                        />

                                    </FormControl>
                                    <Box
                                        sx={{
                                            width: '49%'
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
                                                onChange={(e, value) => setYear(value)}
                                                required
                                            >
                                                <Option value="2017">2017</Option>
                                                <Option value="2018">2018</Option>
                                                <Option value="2019">2019</Option>
                                                <Option value="2020">2020</Option>
                                                <Option value="2021">2021</Option>
                                                <Option value="2022">2022</Option>
                                                <Option value="2023">2023</Option>
                                                <Option value="2024">2024</Option>
                                                <Option value="2025">2025</Option>
                                                <Option value="2026">2026</Option>
                                            </Select>
                                            <Select
                                                size="sm"
                                                placeholder="Ciclo"
                                                onChange={(e, value) => setCycle(value)}
                                                required
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
