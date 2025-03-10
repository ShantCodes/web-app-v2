import { ReactNode } from 'react';
import { ButtonProps } from 'src/modules/general/components/Button/index.types';

export interface EmptyBoxProps {
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  button?: ButtonProps;
}
