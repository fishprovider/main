import { Button as ButtonT, ButtonProps } from 'tamagui';

type Props = ButtonProps;

export default function Button({
  children,
  ...rest
}: Props) {
  return (
    <ButtonT
      theme="blue"
      {...rest}
    >
      {children}
    </ButtonT>
  );
}
