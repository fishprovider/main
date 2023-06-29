import { Flex as MFlex, FlexProps } from '@mantine/core';

interface Props extends FlexProps {
  children: React.ReactNode;
}

function Flex({ children, ...rest }: Props) {
  return (
    <MFlex {...rest}>
      {children}
    </MFlex>
  );
}

export default Flex;
