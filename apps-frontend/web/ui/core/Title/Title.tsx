import { Title as MTitle, TitleProps } from '@mantine/core';

interface Props extends TitleProps {
  children: React.ReactNode;
}

function Title({ children, ...rest }: Props) {
  return (
    <MTitle {...rest}>
      {children}
    </MTitle>
  );
}

export default Title;
