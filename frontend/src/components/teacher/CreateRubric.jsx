import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/joy/Button';
import Add from '@mui/icons-material/Add';
import ModalFrame from '../ModalFrame';

export default function CreateRubric() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = (value) => {
        setIsModalOpen(value);
    }

    return (
        <React.Fragment>
            <Button
                color="primary"
                // size="sm"
                startDecorator={<Add />}
                onClick={handleOpenModal}
            >
                Nueva rubrica
            </Button>
            <ModalFrame
                open={isModalOpen}
                onClose={handleCloseModal}
                ModalTitle="Crear rubrica">
                <p>Contenido del modal</p>
            </ModalFrame>
        </React.Fragment>
    )
}