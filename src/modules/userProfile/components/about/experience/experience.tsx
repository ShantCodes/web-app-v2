import React from 'react';
import { verificationStatus } from 'src/core/utils';
import { translate } from 'src/core/utils'; // Assuming translate function is available
import { AlertModal } from 'src/modules/general/components/AlertModal';
import { Button } from 'src/modules/general/components/Button';
import { FeaturedIcon } from 'src/modules/general/components/featuredIcon-new';
import { Icon } from 'src/modules/general/components/Icon';
import { StepperCard } from 'src/modules/general/components/stepperCard';
import { Verified } from 'src/modules/general/components/stepperCard/stepperCard.types';
import { CreateUpdateExperience } from 'src/modules/userProfile/containers/createUpdateExperience';
import { VerifyExperience } from 'src/modules/userProfile/containers/verifyExperience';
import variables from 'src/styles/constants/_exports.module.scss';

import { useExperience } from './useExperience';
import css from '../about.module.scss';
import { ClaimCertificateModal } from '../claimCertificateModal';

interface ExperienceProps {
  handleOpenVerifyModal: () => void;
}

export const Experiences: React.FC<ExperienceProps> = ({ handleOpenVerifyModal }) => {
  const {
    userExperiences,
    hasMoreExperiences,
    myProfile,
    openModal,
    experience,
    handleEdit,
    handleAdd,
    handleDelete,
    getStringDate,
    handleClose,
    onOpenVerifyModal,
    handleRequestVerify,
    disabledClaims,
    reqModelShow,
    userVerified,
    handleOpenClaimModal,
    handleClaimVC,
    claimUrl,
    showAll,
    setShowAll,
  } = useExperience();

  return (
    <>
      <div className="w-full flex flex-col gap-5">
        <div className={css.title}>{translate('experiences.title')}</div>
        {myProfile && (
          <Button variant="text" color="primary" className={css.addBtn} onClick={handleAdd}>
            <Icon name="plus" fontSize={20} color={variables.color_primary_700} />
            {translate('experiences.addExperience')}
          </Button>
        )}
        {userExperiences && (
          <div className="md:pr-48 flex flex-col gap-5">
            {userExperiences.map(item => (
              <>
                <StepperCard
                  key={item.id}
                  iconName="building-05"
                  img={item.org.image?.url}
                  title={item.title}
                  subtitle={item.org.name}
                  supprtingText={`${getStringDate(item.start_at)} - ${
                    item.end_at ? getStringDate(item.end_at) : translate('experiences.now')
                  }`}
                  DisplayVerificationStatus
                  verified={
                    item.credential?.status
                      ? verificationStatus[item.credential?.status]
                      : (translate('experiences.unverified') as Verified)
                  }
                  description={item.description}
                  editable={myProfile}
                  deletable={myProfile}
                  handleEdit={() => handleEdit(item)}
                  handleDelete={() => handleDelete(item.id)}
                  verifyButton={{
                    display: myProfile && (!item.credential || item.credential?.status === 'PENDING'),
                    label: item.credential
                      ? translate('experiences.verificationPending')
                      : translate('experiences.verifyExperience'),
                    disabled: !!item.credential,
                    action: () => onOpenVerifyModal(item),
                  }}
                  claimButton={{
                    display:
                      myProfile && (item.credential?.status === 'APPROVED' || item.credential?.status === 'SENT'),
                    label:
                      item.credential?.status === 'APPROVED'
                        ? translate('experiences.claimCertificate')
                        : translate('experiences.certificateClaimed'),
                    disabled: !!disabledClaims[item.credential?.id || ''] || item.credential?.status === 'SENT',
                    action: userVerified ? () => handleOpenClaimModal(item.credential?.id) : handleOpenVerifyModal,
                  }}
                />
                {myProfile && item.credential?.status === 'REJECTED' && (
                  <div
                    className={css.status}
                    style={{ borderColor: variables.color_error_500, color: variables.color_error_500 }}
                  >
                    <Icon name="x-close" color={variables.color_error_500} />
                    <span>
                      {translate('experiences.rejectedFrom')} {item.org.name}
                    </span>
                  </div>
                )}
              </>
            ))}
            {!showAll && hasMoreExperiences && (
              <span className={css.more} onClick={() => setShowAll(true)}>
                {translate('experiences.showAll')}
              </span>
            )}
          </div>
        )}
      </div>
      <AlertModal
        open={reqModelShow}
        onClose={handleClose}
        message={translate('experiences.verificationRequestSent')}
        title={translate('experiences.requestSent')}
        customIcon={<FeaturedIcon iconName="check-circle" size="md" theme="success" type="light-circle-outlined" />}
        closeButtn={true}
        closeButtonLabel={translate('experiences.close')}
        submitButton={false}
      />
      {claimUrl && (
        <ClaimCertificateModal
          open={openModal.name === 'claim' && openModal.open}
          link={claimUrl}
          handleClose={handleClose}
          handleClaimVC={handleClaimVC}
        />
      )}
      <CreateUpdateExperience
        open={(openModal.name === 'add' || openModal.name === 'edit') && openModal.open}
        handleClose={handleClose}
        experience={experience}
        readonly={
          experience?.credential && ['APPROVED', 'SENT', 'CLAIMED'].includes(experience.credential?.status || '')
        }
      />
      {!!experience && (
        <VerifyExperience
          open={openModal.name === 'verify' && openModal.open}
          handleClose={handleClose}
          experience={experience}
          onVerifyExperience={handleRequestVerify}
        />
      )}
    </>
  );
};
