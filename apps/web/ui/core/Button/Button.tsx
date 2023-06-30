import { Button as MButton, ButtonProps } from '@mantine/core';

interface Props extends ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.SyntheticEvent) => void;
}

function Button({ children, ...rest }: Props) {
  return (
    <MButton {...rest}>
      {children}
    </MButton>
  );
}

export default Button;
