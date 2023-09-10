import { Text as MText, TextProps } from '@mantine/core';

interface Props extends TextProps {
  children: React.ReactNode;
}

function Text({ children, ...rest }: Props) {
  return (
    <MText {...rest}>
      {children}
    </MText>
  );
}

export default Text;
