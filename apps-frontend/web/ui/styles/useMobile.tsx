import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const useMobile = () => {
  const theme = useMantineTheme();
  const { xs: mobileWidth } = theme.breakpoints;

  const isMobile = useMediaQuery(`(max-width: ${mobileWidth})`);
  return isMobile;
};

export default useMobile;
