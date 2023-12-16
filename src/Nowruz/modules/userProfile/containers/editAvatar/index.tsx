import React from 'react';
import Cropper from 'react-easy-crop';
import { Button } from 'src/Nowruz/modules/general/components/Button';
import { Modal } from 'src/Nowruz/modules/general/components/modal';

import css from './editAvatar.module.scss';
import { useEditAvatar } from './useEditAvatar';

interface EditAvatarModalProps {
  open: boolean;
  handleClose: () => void;
}
export const EditAvatarModal: React.FC<EditAvatarModalProps> = ({ open, handleClose }) => {
  const {
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
    saveProfileImage,
    imageURL,
    handleChangePhoto,
    uploadError,
    handleRemovePhoto,
  } = useEditAvatar(handleClose);

  const modalFooterJsx = (
    <div className="w-full flex flex-col md:flex-row-reverse px-4 py-4 md:px-6 md:py-6 gap-3 md:justify-start">
      <Button customStyle="w-full md:w-fit " variant="contained" color="primary" onClick={saveProfileImage}>
        Save
      </Button>
      <Button customStyle="w-full md:w-fit " variant="outlined" color="primary" onClick={handleChangePhoto}>
        Change photo
      </Button>
      <Button
        variant="text"
        color="error"
        //  className=""
        customStyle="md:ml-0 md:mr-auto text-Error-700"
        onClick={handleRemovePhoto}
      >
        Remove Photo
      </Button>
    </div>
  );

  const cropperContentJsx = (
    <div className={css.cropContainer}>
      <div className={css.cropAbsolute}>
        <Cropper
          image={imageURL}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          cropSize={{
            width: 500,
            height: 500,
          }}
        />
      </div>
    </div>
  );
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Edit profile photo"
      subTitle="Upload a square image for best results."
      content={cropperContentJsx}
      footer={modalFooterJsx}
    />
  );
};

export default EditAvatarModal;
