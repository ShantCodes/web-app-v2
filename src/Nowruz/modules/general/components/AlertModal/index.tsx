import { Modal } from '@mui/material';
import React from 'react';
import variables from 'src/components/_exports.module.scss';
import { Icon } from 'src/Nowruz/general/Icon';
import { Button } from 'src/Nowruz/modules/general/components/Button';

import css from './alert-modal.module.scss';
import { AlertModalProps } from './AlertModal.types';
export const AlertModal: React.FC<AlertModalProps> = ({ open, onClose, message, customImage, title, onSubmit }) => {
  return (
    <Modal open={open} onClose={onClose} className={css.modal}>
      <div className={css.container}>
        <div className="flex justify-between">
          <img className={css.image} src={customImage || '/icons/success-tick.svg'} />
          <Icon name="x-close" fontSize={24} color={variables.color_grey_500} className=" cursor-pointer" onClick={onClose}/>
        </div>
        <div className={css.title}>{title}</div>
        <div className={css.message}>{message}</div>
        <Button color="secondary" variant="outlined" onClick={onSubmit}>
          Close
        </Button>
      </div>
    </Modal>
  );
};
