import { Stack as MStack, StackProps } from '@mantine/core';

interface Props extends StackProps {
  children: React.ReactNode;
}

function Stack({ children, ...rest }: Props) {
  return (
    <MStack {...rest}>
      {children}
    </MStack>
  );
}

export default Stack;
