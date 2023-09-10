import type { TextInputProps } from '@mantine/core';

import TextInput from '~ui/core/TextInput';

interface Props extends Omit<TextInputProps, 'onChange'> {
  onChange?: (value: string) => void;
}

function NumberInput(props: Props) {
  const { rightSection, onChange } = props;
  return (
    <TextInput
      type="number"
      rightSectionWidth={rightSection ? 50 : undefined}
      {...props}
      onChange={(event) => {
        if (!onChange) return;
        onChange(event.currentTarget.value);
      }}
    />
  );
}

export default NumberInput;
