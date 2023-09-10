import Box from '~ui/core/Box';
import styled from '~ui/styles/styled';

interface Props {
  children: React.ReactNode;
  variant: 'dark' | 'light' | 'blue' | 'green' | 'yellow';
  bg?: string;
}

const PageSection = styled(Box)<Props>`
  background-color: ${({ theme, variant }) => {
    if (variant === 'dark') return '#0a0a23';
    if (variant === 'light') return '#f2f3f6';
    if (variant === 'blue') return '#e7f5ff';
    if (variant === 'green') return '#e6fcf5';
    if (variant === 'yellow') return '#fff9db';
    return theme.colorScheme === 'dark' ? '#0a0a23' : '#f2f3f6';
  }};
  color: ${({ theme, variant }) => {
    if (variant === 'dark') return '#f2f3f6';
    if (variant === 'light') return '#0a0a23';
    if (variant === 'blue') return '#0a0a23';
    if (variant === 'green') return '#0a0a23';
    if (variant === 'yellow') return '#0a0a23';
    return theme.colorScheme === 'dark' ? '#f2f3f6' : '#0a0a23';
  }};
  background-image: ${({ bg }) => bg && `url(${bg})`};
  background-position: center;
  background-size: cover;
`;

export default PageSection;
