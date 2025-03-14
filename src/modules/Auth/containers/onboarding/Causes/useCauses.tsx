import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SOCIAL_CAUSES } from 'src/constants/SOCIAL_CAUSES';
import { translate } from 'src/core/utils';
import { StepsContext } from 'src/modules/Auth/containers/onboarding/Stepper';
import { useUser } from 'src/modules/Auth/contexts/onboarding/sign-up-user-onboarding.context';
import { RootState } from 'src/store';
type SocialCauseVal = {
  label: string;
  value: string;
};
export const useCauses = () => {
  const keyItems = Object.keys(SOCIAL_CAUSES);
  const [value, setValue] = useState<SocialCauseVal[]>([]);
  const { state, updateUser } = useUser();
  const { updateSelectedStep } = useContext(StepsContext);
  const { isImportingLinkedIn } = useSelector((state: RootState) => state.linkedin);
  const items = keyItems.map(i => {
    return { value: SOCIAL_CAUSES[i].value, label: translate(SOCIAL_CAUSES[i].value) };
  });

  useEffect(() => {
    if (state.social_causes) setValue(getOptionsFromValues(state.social_causes));
  }, []);

  useEffect(() => {
    updateUser({ ...state, social_causes: value.map(e => e.value) });
  }, [value]);

  const getOptionsFromValues = values => values.map(value => translate(SOCIAL_CAUSES[value]));

  const onNextStep = () => updateSelectedStep(isImportingLinkedIn ? 6 : 3);

  return { items, value, setValue, onNextStep };
};
