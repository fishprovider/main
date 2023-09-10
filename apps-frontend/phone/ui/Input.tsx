import { Input as InputT, type InputProps } from 'tamagui';

import Label from './Label';
import Stack from './Stack';

interface Props extends Omit<InputProps, 'onChange'> {
  id: string;
  onChange?: (value: string) => void;
  label?: React.ReactNode;
}

export default function Input({
  id,
  label,
  onChange,
  ...rest
}: Props) {
  return (
    <Stack space="$0" flex={1}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputT
        id={id}
        onChangeText={onChange}
        {...rest}
      />
    </Stack>
  );
}
