import { TimeInput as MTimeInput, TimeInputProps } from '@mantine/dates';
import { useRef } from 'react';

import Icon from '~ui/core/Icon';

type Props = TimeInputProps;

function TimeInput({
  ...rest
}: Props) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <MTimeInput
      {...rest}
      ref={ref}
      rightSection={(
        <Icon name="Schedule" button onClick={() => ref.current?.showPicker()} />
      )}
    />
  );
}

export default TimeInput;
