import Box from '~ui/core/Box';
import styled from '~ui/styles/styled';

interface Props {
  children: React.ReactNode;
  variant: 'dark' | 'light' | 'blue' | 'green' | 'yellow';
  bg?: string;
}

const colors = {
  white: '#f2f3f6',
  dark: '#0a0a23',
  blue: '#afdaeb',
  green: '#e6fcf5',
  yellow: '#fff9db',
};

const PageSection = styled(Box)<Props>`
  background-color: ${({ theme, variant }) => {
    if (variant === 'dark') return colors.dark;
    if (variant === 'light') return colors.white;
    if (variant === 'blue') return colors.blue;
    if (variant === 'green') return colors.green;
    if (variant === 'yellow') return colors.yellow;
    return theme.colorScheme === 'dark' ? colors.dark : colors.white;
  }};
  color: ${({ theme, variant }) => {
    if (variant === 'dark') return colors.white;
    if (variant === 'light') return colors.dark;
    if (variant === 'blue') return colors.dark;
    if (variant === 'green') return colors.dark;
    if (variant === 'yellow') return colors.dark;
    return theme.colorScheme === 'dark' ? colors.white : colors.dark;
  }};
  background-image: ${({ bg }) => bg && `url(${bg})`};
  background-position: center;
  background-size: cover;
`;

export default PageSection;
