import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/joy/Button';
import Add from '@mui/icons-material/Add';

export default function CreateRubric() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = (value) => {
        setIsModalOpen(value);
    }
    return(
        <React.Fragment>
            <Button
                color="primary"
                // size="sm"
                startDecorator={<Add />}
                onClick={handleOpenModal}
            >
                Crear rubrica
            </Button>
        </React.Fragment>
    )
}