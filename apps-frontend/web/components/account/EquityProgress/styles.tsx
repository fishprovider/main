import Progress from '~ui/core/Progress';
import styled from '~ui/styles/styled';

interface Props {
  flip?: boolean;
}

const ProgressStyled = styled(Progress)<Props>`
  transform: ${({ flip }) => flip && 'scaleX(-1)'};
`;

export {
  ProgressStyled,
};
