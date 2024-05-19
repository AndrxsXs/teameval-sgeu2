import { Box, Typography } from "@mui/joy";
import CreateStudent from "../../../components/teacher/CreateStudent";
import BodyAddStudent from "../../../components/teacher/BodyAddStudent";
import { useState } from 'react';
import { Button, Modal, Sheet } from "@mui/joy";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ImportStudent from "../../../components/teacher/ImportStudent";

export default function AddStudent() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <>
            <Box
                component="header"
                sx={{
                    display: 'flex',
                    mt: 2,
                    mb: 1,
                    gap: 1,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'start', sm: 'center' },
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                <Typography level="h2" component="h1">
                    Nombre del curso
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}
                >
                    <CreateStudent />
                    <Button
                        color="primary"
                        
                        startDecorator={<FileUploadIcon />}
                        onClick={handleOpenModal}
                    >
                        Importar estudiantes
                    </Button>
                </Box>
                <BodyAddStudent />
            </Box>

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={isModalOpen}
                onClose={handleCloseModal}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        maxWidth: 500,
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                    }}
                >
                    <ImportStudent handleClose={handleCloseModal} />
                </Sheet>
            </Modal>
        </>
    );
}