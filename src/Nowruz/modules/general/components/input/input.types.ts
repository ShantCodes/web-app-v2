import { OutlinedInputProps as DefaultProps } from '@mui/material';
import { ReactNode } from 'react';
import { Props } from 'react-select';

type Option = { value: string; label: string; icon?: ReactNode };
interface DropdownProps extends Props {
  options: Option[];
  minWidth?: string;
}
export interface InputProps extends DefaultProps {
  id?: string;
  name?: string;
  label?: string;
  required?: boolean;
  errors?: string[];
  isValid?: boolean;
  validMessage?: string;
  prefix?: string;
  customHeight?: string;
  register?: any;
  hints?: Array<{ hint: string; hide: boolean }>;
  startIcon?: ReactNode;
  prefixDropdown?: DropdownProps;
  postfixDropdown?: DropdownProps;
}
