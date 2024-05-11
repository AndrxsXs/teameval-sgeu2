/* eslint-disable react/prop-types */
import * as React from 'react';
import { Transition } from 'react-transition-group';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';

import Divider from '@mui/joy/Divider'

export default function ModalFrame({ children, open, onClose, ModalTitle }) {

    return (
        <React.Fragment>
            <Transition in={open} timeout={400}>
                {(state) => (
                    <Modal
                        keepMounted
                        open={!['exited', 'exiting'].includes(state)}
                        onClose={() => onClose(false)}
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
                            <DialogTitle>
                                {ModalTitle}
                            </DialogTitle>
                            <Divider
                                variant="fullWidth"
                                orientation="horizontal"
                            />
                            {/* <DialogContent>Fill in the information of the project.</DialogContent> */}
                            {children}
                        </ModalDialog>
                    </Modal>
                )}
            </Transition>
        </React.Fragment >
    )
}