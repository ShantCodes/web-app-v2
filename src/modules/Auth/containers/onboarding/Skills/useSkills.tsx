import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { skillsToCategoryAdaptor } from 'src/core/adaptors';
import { StepsContext } from 'src/modules/Auth/containers/onboarding/Stepper';
import { useUser } from 'src/modules/Auth/contexts/onboarding/sign-up-user-onboarding.context';
import { MultiSelectItem } from 'src/modules/general/components/multiSelect/multiSelect.types';
import { RootState } from 'src/store';

interface Option {
  value: string;
  label: string;
}
export const useSkills = () => {
  const { t: translate } = useTranslation();
  const [value, setValue] = useState<MultiSelectItem[]>([]);
  const [items, setItems] = useState<Option[]>([]);
  const { state, updateUser } = useUser();
  const { updateSelectedStep } = useContext(StepsContext);
  const { isImportingLinkedIn } = useSelector((state: RootState) => state.linkedin);

  useEffect(() => {
    skillsToCategoryAdaptor().then(data => {
      setValue(getOptionsFromValues(state.skills || [], data));
      setItems(data);
    });
  }, []);

  useEffect(() => {
    updateUser({ ...state, skills: value.map(e => e.value) });
  }, [value]);

  const getOptionsFromValues = (values, options) => options.filter(option => values.includes(option.value));

  const onNextStep = () => updateSelectedStep(isImportingLinkedIn ? 7 : 4);

  return { items, value, setValue, onNextStep, translate };
};
