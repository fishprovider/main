import { RadioGroup as RadioGroupT, type RadioGroupProps } from 'tamagui';

import Group from './Group';
import Label from './Label';

interface Props extends RadioGroupProps {
  options: {
    value: string;
    label: React.ReactNode;
  }[],
  onChange?: (value: string) => void;
}

export default function RadioGroup({
  options,
  onChange,
  ...rest
}: Props) {
  return (
    <RadioGroupT
      onValueChange={onChange}
      space="$4"
      theme="blue"
      orientation="horizontal"
      {...rest}
    >
      {options.map((item) => (
        <Group key={item.value}>
          <RadioGroupT.Item value={item.value} id={item.value}>
            <RadioGroupT.Indicator />
          </RadioGroupT.Item>
          <Label htmlFor={item.value}>{item.label}</Label>
        </Group>
      ))}
    </RadioGroupT>
  );
}
