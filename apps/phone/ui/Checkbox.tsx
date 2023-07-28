import { Checkbox as CheckboxT, type CheckboxProps } from 'tamagui';

import Group from './Group';
import Label from './Label';

interface Props extends CheckboxProps {
  id: string,
  onChange?: (value: boolean) => void;
  label?: string;
}

export default function Checkbox({
  id,
  onChange,
  label,
  ...rest
}: Props) {
  return (
    <Group>
      <CheckboxT
        id={id}
        onCheckedChange={onChange}
        {...rest}
      >
        <CheckboxT.Indicator />
      </CheckboxT>
      {label && <Label htmlFor={id}>{label}</Label>}
    </Group>
  );
}
