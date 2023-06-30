import { Select as MSelect, SelectProps } from '@mantine/core';

interface Props extends SelectProps {
  withinPortal?: boolean;
}

function Select({
  withinPortal = true,
  ...rest
}: Props) {
  return (
    <MSelect
      withinPortal={withinPortal}
      {...rest}
    />
  );
}

export default Select;
