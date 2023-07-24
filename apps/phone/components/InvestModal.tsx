import { useState } from 'react';

import Button from '~ui/Button';
import Select from '~ui/Select';
import Stack from '~ui/Stack';
import { useToast } from '~ui/ToastProvider';

const options = [
  { value: 'Apple', label: 'Apple' },
  { value: 'Pear', label: 'Pear' },
  { value: 'Blackberry', label: 'Blackberry' },
  { value: 'Peach', label: 'Peach' },
  { value: 'Apricot', label: 'Apricot' },
  { value: 'Melon', label: 'Melon' },
  { value: 'Honeydew', label: 'Honeydew' },
  { value: 'Starfruit', label: 'Starfruit' },
  { value: 'Blueberry', label: 'Blueberry' },
  { value: 'Raspberry', label: 'Raspberry' },
  { value: 'Strawberry', label: 'Strawberry' },
  { value: 'Mango', label: 'Mango' },
  { value: 'Pineapple', label: 'Pineapple' },
  { value: 'Lime', label: 'Lime' },
  { value: 'Lemon', label: 'Lemon' },
  { value: 'Coconut', label: 'Coconut' },
  { value: 'Guava', label: 'Guava' },
  { value: 'Papaya', label: 'Papaya' },
  { value: 'Orange', label: 'Orange' },
  { value: 'Grape', label: 'Grape' },
  { value: 'Jackfruit', label: 'Jackfruit' },
  { value: 'Durian', label: 'Durian' },
];

function SelectDemo() {
  const [val, setVal] = useState('Apple');
  return (
    <Select
      options={options}
      value={val}
      onChange={setVal}
    />
  );
}

interface Props {
  providerId: string;
}

export default function InvestModal({ providerId }: Props) {
  const toast = useToast();

  const onInvest = () => {
    toast.show('Coming soon');
  };

  return (
    <Stack>
      <Button onPress={onInvest}>{providerId}</Button>
      <SelectDemo />
    </Stack>
  );
}
