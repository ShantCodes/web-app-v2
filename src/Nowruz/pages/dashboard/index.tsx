import { useLoaderData, useNavigate } from 'react-router-dom';
import { ImpactPoints, Organization, User } from 'src/core/api';
import { Typography } from '@mui/material';
import { Impact } from 'src/Nowruz/modules/userProfile/components/impact';
import { Button } from 'src/Nowruz/modules/general/components/Button';
import { Icon } from 'src/Nowruz/general/Icon';
import ProfileCard from 'src/Nowruz/modules/general/components/profileCard';
import { Card } from 'src/Nowruz/modules/dashboard/card';
import { getIdentityMeta } from 'src/core/utils';
import { FeaturedIconOutlined } from 'src/Nowruz/modules/general/components/featuredIconOutlined';
import { UserCards } from 'src/Nowruz/modules/dashboard/userCards';
import { OrgCards } from 'src/Nowruz/modules/dashboard/orgCards';
import { VerifyModal } from 'src/Nowruz/modules/refer/verifyModal';
import { useState } from 'react';

export const Dashboard = () => {
  const { profileData, impactPointHistory } = useLoaderData() as {
    profileData: User | Organization;
    impactPointHistory: ImpactPoints;
  };
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  let hoursWorked = 0;
  let hoursVolunteered = 0;
  const { name, type, usernameVal } = getIdentityMeta(profileData);
  const verified = type === 'users' ? (profileData as User).identity_verified : (profileData as Organization).verified;
  const profileUrl =
    type === 'users' ? `/profile/users/${usernameVal}/view` : `/profile/organizations/${usernameVal}/view`;

  if (impactPointHistory) {
    impactPointHistory.items
      .filter((item) => item.offer !== null)
      .forEach((item) => {
        if (item.offer) {
          if ((item?.offer?.currency && ['USD', 'YEN'].includes(item?.offer?.currency)) || item.offer.currency)
            hoursWorked += item.offer.total_hours;
          else hoursVolunteered += item.offer.total_hours;
        }
      });
  }

  return (
    <>
      <div className=" w-full flex ">
        <div className="w-full h-full flex flex-col">
          {!verified && (
            <div className="w-full  px-4 py-4 md:px-8 md:py-1 bg-Warning-25 border border-t-0 border-x-0 border-b border-solid border-Warning-300 flex flex-col md:flex-row gap-4 md:justify-between">
              <div className="flex gap-4 items-center">
                <div className="hidden md:flex">
                  <FeaturedIconOutlined theme="warning" iconName="alert-circle" size="md" />
                </div>
                <div className="flex flex-col md:flex-row gap-[2px] md:gap-1.5">
                  <span className="font-semibold text-sm text-Warning-700">
                    {type === 'users' ? 'Verify your identity' : 'Verify your organization'}
                  </span>
                  <span className="font-normal text-sm text-Warning-700">
                    {type === 'users'
                      ? 'In order to access referrals, you need to have a Atala PRISM DID and verify your identity.'
                      : 'Get a 50% discount on Socious fee for 1 month.'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="text" color="error" customStyle="text-Warning-600">
                  Learn more
                </Button>
                <Button
                  variant="text"
                  color="error"
                  customStyle="text-Warning-700 flex gap-2 items-center"
                  onClick={() => setOpenVerifyModal(true)}
                >
                  Verify now
                  <Icon name="arrow-right" fontSize={20} className="text-Warning-700" />
                </Button>
              </div>
            </div>
          )}
          <div className=" flex flex-col gap-8 py-8 px-4 md:px-8">
            <div className="flex flex-col gap-1">
              <Typography variant="h3" className="text-Gray-light-mode-900">
                👋 Welcome back, {type === 'users' ? (profileData as User).first_name : name}
              </Typography>
              {type === 'users' && (
                <Typography variant="h5" className="text-Gray-light-mode-600">
                  Your current impact and activity.
                </Typography>
              )}
            </div>
            {type === 'users' ? (
              <UserCards
                profileCompleted={!!profileData.bio && !!(profileData as User).experiences?.length}
                profileUrl={profileUrl}
              />
            ) : (
              <OrgCards profileCompleted={!!(profileData as Organization).culture} profileUrl={profileUrl} />
            )}
            {type === 'users' && (
              <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-4 md:grid-rows-2 gap-4">
                <div className="row-span-2 col-span-2 md:col-span-1">
                  <Impact myProfile={true} point={profileData.impact_points} />
                </div>
                <div className="row-span-1 col-span-1">
                  <Card
                    iconName="clock"
                    cardText={'Total hours contributed'}
                    number={hoursWorked + hoursVolunteered}
                    unit="hrs"
                  />
                </div>
                <div className="row-span-1 col-span-1">
                  <Card iconName="clock" cardText={'Hours worked'} number={hoursWorked} unit="hrs" />
                </div>
                <div className="row-span-1 col-span-1">
                  <Card iconName="clock" cardText={'Hours volunteered'} number={hoursVolunteered} unit="hrs" />
                </div>
                {/* <div className="row-span-1 col-span-1">
            <Card iconName="currency-dollar" cardText={'Donated'} number={`$${donated}`} />
          </div> */}
              </div>
            )}
          </div>
        </div>
        <div className="hidden md:flex w-[392px] h-full">
          <ProfileCard identity={profileData} labelShown={false} rounded={false} />
        </div>
      </div>

      <VerifyModal open={openVerifyModal} handleClose={() => setOpenVerifyModal(false)} />
    </>
  );
};
