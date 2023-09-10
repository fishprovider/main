import NextLink from 'next/link';

import { LinkStyled } from './styles';

interface Props {
  children?: React.ReactNode;
  href?: string;
  variant?: 'default' | 'noColor' | 'hoverOnly' | 'clean' ;
  onClick?: (_: any) => void;
  target?: any;
}

function Link({
  children = null,
  href = '#',
  variant = 'default',
  onClick = () => undefined,
  target = '_self',
}: Props) {
  return (
    <NextLink passHref href={href} legacyBehavior>
      <LinkStyled
        variant={variant}
        onClick={(event) => {
          if (onClick) onClick(event);
        }}
        target={target}
      >
        {children}
      </LinkStyled>
    </NextLink>
  );
}

export default Link;
