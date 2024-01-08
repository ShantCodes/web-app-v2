import { Camera } from '@capacitor/camera';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CurrentIdentity, uploadMedia } from 'src/core/api';
import { updateProfile as updateProfileApi } from 'src/core/api';
import { isTouchDevice } from 'src/core/device-type-detector';
import { removeValuesFromObject } from 'src/core/utils';
import { useUser } from 'src/Nowruz/modules/Auth/contexts/onboarding/sign-up-user-onboarding.context';
import { RootState } from 'src/store';

export const useImageBio = () => {
  const navigate = useNavigate();
  const [uploadError, setUploadError] = useState('');
  const { state, updateUser } = useUser();
  const isMobile = isTouchDevice();
  const [image, setImage] = useState({ imageUrl: state.avatar?.url, id: '' });
  const currentIdentity = useSelector<RootState, CurrentIdentity>((state) => {
    const current = state.identity.entities.find((identity) => identity.current);
    return current as CurrentIdentity;
  });
  const onUploadImage = async () => {
    const { webPath } = await Camera.pickImages({ limit: 1 }).then(({ photos }) => photos[0]);
    const resp = await uploadImage(webPath);
    updateUser({ ...state, avatar: resp });
    setImage({ imageUrl: resp.url, id: resp.id });
  };

  const removeImage = async () => {
    setImage({ imageUrl: '', id: '' });
    updateUser({ ...state, avatar: null });
  };

  const updateProfile = () => {
    const avatarImage = state.avatar ? { avatar: image.id } : {};
    const updatedObj = removeValuesFromObject(
      {
        ...state,
        ...avatarImage,
      },
      ['', null],
    );

    delete updatedObj.cityLabel;
    updateProfileApi(updatedObj).then(() => {
      if (isMobile)
        navigate(`/sign-up/user/notification`, {
          state: {
            username: currentIdentity.meta?.username,
          },
        });
      else navigate(`/profile/users/${currentIdentity.meta?.username}/view`);
    });
  };

  const updateBio = (bio: string) => {
    if (bio.length <= 160) updateUser({ ...state, bio });
  };

  async function uploadImage(url: string) {
    const blob = await fetch(url).then((resp) => resp.blob());
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    if (blob.size > MAX_IMAGE_SIZE) {
      setUploadError(`Image should be less than 5MB`);
    } else {
      setUploadError(``);

      const formData = new FormData();
      formData.append('file', blob);
      return uploadMedia(blob as File);
    }
  }

  const isValidForm = state.bio === '' || state.bio === null;
  const bio = state.bio;
  const bioCounter = state.bio ? state.bio.length : 0;
  return { onUploadImage, updateBio, image, isValidForm, bio, updateProfile, bioCounter, uploadError };
};
