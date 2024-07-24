import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLoaderData, useLocation } from 'react-router-dom';
import { OrganizationProfile } from 'src/core/api';
import { ValueContainer } from 'src/modules/preferences/valueContainer';
import { About } from 'src/modules/userProfile/components/about';
import { OrganizationJobs } from 'src/modules/userProfile/components/jobs';
import { setIdentity, setIdentityType } from 'src/store/reducers/profile.reducer';

export const useOrgProfile = () => {
  const location = useLocation();
  const [active, setActive] = useState(0);
  const dispatch = useDispatch();
  const { organization } = useLoaderData() as { organization: OrganizationProfile };

  dispatch(setIdentity(organization));
  dispatch(setIdentityType('organizations'));

  useEffect(() => {
    if (location.pathname.includes(`/jobs`)) {
      setActive(1);
    }
  }, [location]);

  const tabs = [
    { label: 'About', content: <About /> },
    { label: 'Jobs', content: <OrganizationJobs /> },
    // TODO: Use <ValueContainer/> inside the preferences component (developed by Sanaz) and then put the preferences component in tab
    { label: 'Preferences', content: <ValueContainer /> },
  ];

  return { tabs, active };
};
