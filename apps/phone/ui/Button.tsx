import { Button as ButtonT, ButtonProps } from 'tamagui';

export default function Button({
  themeInverse = false,
  children,
  ...rest
}: ButtonProps) {
  return (
    <ButtonT themeInverse={themeInverse} {...rest}>
      {children}
    </ButtonT>
  );
}
