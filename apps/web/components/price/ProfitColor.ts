import styled from '~ui/styles/styled';

interface Props {
  profit: number;
}

const ProfitColor = styled('span')<Props>`
  color: ${({ theme, profit }) => {
    if (profit > 0) return theme.colors.green[9];
    if (profit < 0) return theme.colors.red[9];
    return 'inherit';
  }};
`;

export default ProfitColor;
