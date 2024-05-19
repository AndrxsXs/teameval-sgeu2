// ModalContainer.jsx
import React, { useState } from 'react';
import { Modal, Sheet } from '@mui/joy';
import ImportWindow from './import/ImportWindow';

const ModalContainer = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <ImportWindow handleOpen={handleOpen} />
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={handleClose}
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
          <ImportStudent handleClose={handleClose} />
        </Sheet>
      </Modal>
    </>
  );
};

export default ModalContainer;