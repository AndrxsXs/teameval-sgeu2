import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import IconButton from '@mui/joy/IconButton';
import Box from '@mui/joy/Box';
// import Typography from '@mui/joy/Typography';

// import Textarea from '@mui/joy/Textarea';
import Stack from '@mui/joy/Stack';
// import Select from '@mui/joy/Select';
// import Option from '@mui/joy/Option';

import Add from '@mui/icons-material/Add';
import { Transition } from 'react-transition-group';
import Divider from '@mui/joy/Divider'
import { AspectRatio } from '@mui/joy';

import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
// import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

// import DropZone from './DropZone';
// import FileUpload from './FileUpload';
// import CountrySelector from './CountrySelector';
// import EditorToolbar from './EditorToolbar';


export default function CreateAdmin() {
    const [open, setOpen] = React.useState(false);
    return (
        <React.Fragment>
            <Button
                color="primary"
                // size="sm"
                startDecorator={<Add />}
                onClick={() => setOpen(true)}
            >
                Nuevo administrador
            </Button>
            <Transition in={open} timeout={400}>
                {(state) => (
                    <Modal
                        keepMounted
                        open={!['exited', 'exiting'].includes(state)}
                        onClose={() => setOpen(false)}
                        slotProps={{
                            backdrop: {
                                sx: {
                                    opacity: 0,
                                    backdropFilter: 'none',
                                    transition: `opacity 400ms, backdrop-filter 400ms`,
                                    ...{
                                        entering: { opacity: 1, backdropFilter: 'blur(8px)' },
                                        entered: { opacity: 1, backdropFilter: 'blur(8px)' },
                                    }[state],
                                },
                            },
                        }}
                        sx={{
                            visibility: state === 'exited' ? 'hidden' : 'visible',
                        }}
                    >
                        <ModalDialog
                            sx={{
                                opacity: 0,
                                transition: `opacity 300ms`,
                                ...{
                                    entering: { opacity: 1 },
                                    entered: { opacity: 1 },
                                }[state],
                            }}
                        >
                            <DialogTitle>Crear nuevo administrador</DialogTitle>
                            <Divider
                                variant="fullWidth"
                                orientation="horizontal"
                            />
                            {/* <DialogContent>Fill in the information of the project.</DialogContent> */}
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    setOpen(false);
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
                                        <Stack direction="column" spacing={1} >
                                            <AspectRatio
                                                ratio="1"
                                                maxHeight={200}
                                                sx={{ flex: 1, minWidth: 120, borderRadius: '100%', }}
                                            >
                                                <img
                                                    // src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                                                    // srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                                                    src={PersonRoundedIcon}
                                                    loading="lazy"
                                                    alt=""
                                                />
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
                                                    top: 170,
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
                                            <Stack spacing={1}>
                                                <FormLabel>Nombre</FormLabel>
                                                <FormControl
                                                    //sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                                    sx={{ flexDirection: 'row', gap: 2 }}
                                                >
                                                    <Input size="sm" placeholder="Nombres" type='text' required />
                                                    <Input size="sm" placeholder="Apellidos" type='text' required sx={{ flexGrow: 1 }} />
                                                </FormControl>
                                            </Stack>
                                            <Stack
                                                sx={{ flexDirection: 'row', gap: 2 }}
                                            >
                                                <FormControl>
                                                    <FormLabel>Código</FormLabel>
                                                    <Input size="sm" placeholder="Ingresa el código" type='text' required />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Correo electrónico</FormLabel>
                                                    <Input
                                                        size="sm"
                                                        type="email"
                                                        startDecorator={<EmailRoundedIcon />}
                                                        placeholder="tu.correo@institución.com"
                                                        required
                                                    //defaultValue="siriwatk@test.com"
                                                    //sx={{ flexGrow: 1 }}
                                                    />
                                                </FormControl>
                                            </Stack>
                                            <FormControl
                                                sx={{
                                                    maxWidth: '50%'
                                                }}
                                            >
                                                <FormLabel>Teléfono</FormLabel>
                                                <Input size="sm" placeholder="Ingresa el teléfono" type='text' />
                                            </FormControl>
                                        </Stack>

                                    </Stack>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                        }}
                                    >
                                        <Button
                                            onClick={() => setOpen(false)}
                                            variant='outlined'
                                            color='neutral'
                                        >Cancelar</Button>
                                        <Button type="submit">Crear</Button>
                                    </Box>
                                </Box>
                            </form>
                        </ModalDialog>
                    </Modal>
                )}
            </Transition>
        </React.Fragment>
    );
}
