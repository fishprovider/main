import styled from '~ui/styles/styled';

interface Props {
  variant: 'default' | 'noColor' | 'hoverOnly' | 'clean' ;
}

const LinkStyled = styled('a')<Props>`
  text-decoration: ${({ variant }) => variant && [
    'clean', 'hoverOnly',
  ].includes(variant) && 'none'};
  color: ${({ variant }) => variant && [
    'clean', 'hoverOnly', 'noColor',
  ].includes(variant) && 'inherit'};

  &:hover {
    text-decoration: ${({ variant }) => variant === 'hoverOnly' && 'underline'};
  }
`;

export {
  LinkStyled,
};
