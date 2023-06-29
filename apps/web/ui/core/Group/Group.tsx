import { Group as MGroup, GroupProps } from '@mantine/core';

interface Props extends GroupProps {
  children: React.ReactNode;
}

function Group({ children, ...rest }: Props) {
  return (
    <MGroup {...rest}>
      {children}
    </MGroup>
  );
}

export default Group;
