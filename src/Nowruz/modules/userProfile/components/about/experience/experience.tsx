import variables from 'src/components/_exports.module.scss';
import { Icon } from 'src/Nowruz/general/Icon';
import { Button } from 'src/Nowruz/modules/general/components/Button';
import { StepperCard } from 'src/Nowruz/modules/general/components/stepperCard';
import { CreateUpdateExperience } from 'src/Nowruz/modules/userProfile/containers/createUpdateExperience';

import { useExperience } from './useExperience';
import css from '../about.module.scss';

export const Experiences = () => {
  const {
    user,
    myProfile,
    openModal,
    experience,
    handleEdit,
    handleAdd,
    handleDelete,
    getStringDate,
    handleClose,
    handleRequestVerify,
    handleClaimVC,
    disabledClaims,
  } = useExperience();
  return (
    <>
      <div className="w-full flex flex-col gap-5">
        <div className={css.title}>Experience</div>
        {myProfile && (
          <Button variant="text" color="primary" className={css.addBtn} onClick={handleAdd}>
            <Icon name="plus" fontSize={20} color={variables.color_primary_700} />
            Add experience
          </Button>
        )}
        {user?.experiences && (
          <div className="md:pr-48 flex flex-col gap-5">
            {user?.experiences.map((item) => (
              <>
                <StepperCard
                  key={item.id}
                  iconName="building-05"
                  img={item.org.image?.url}
                  title={item.title}
                  subtitle={item.org.name}
                  supprtingText={`${getStringDate(item.start_at)} - ${
                    item.end_at ? getStringDate(item.end_at) : 'Now'
                  }`}
                  description={item.description}
                  editable={myProfile}
                  deletable={myProfile}
                  handleEdit={() => handleEdit(item)}
                  handleDelete={() => handleDelete(item.id)}
                />
                {/* FIXME: Need to fix this button style should be go in to StepperCard */}
                {/* {myProfile && (!item.credential || item.credential?.status === 'PENDING') && (
                  <Button
                    variant="text"
                    color="secondary"
                    disabled={!!item.credential}
                    className={css.addBtn}
                    onClick={handleRequestVerify(item.id)}
                  >
                    Verify experience
                  </Button>
                )} */}
                {myProfile && item.credential?.status === 'APPROVED' && (
                  <Button
                    variant="text"
                    color="secondary"
                    disabled={!!disabledClaims[item.credential.id]}
                    className={css.addBtn}
                    key={item.credential.id}
                    onClick={handleClaimVC(item.credential.id)}
                  >
                    Claim
                  </Button>
                )}
                {myProfile && item.credential?.status === 'REJECTED' && (
                  <div
                    className={css.status}
                    style={{ borderColor: variables.color_error_500, color: variables.color_error_500 }}
                  >
                    <Icon name="x-close" color={variables.color_error_500} />
                    <span>rejected from {item.org.name}</span>
                  </div>
                )}
                {myProfile && item.credential?.status === 'SENT' && (
                  <div
                    className={css.status}
                    style={{ borderColor: variables.color_success_500, color: variables.color_success_500 }}
                  >
                    <Icon name="check" color={variables.color_success_500} />
                    <span>credentials has been sent</span>
                  </div>
                )}
              </>
            ))}
          </div>
        )}
      </div>
      <CreateUpdateExperience open={openModal} handleClose={handleClose} experience={experience} />
    </>
  );
};
