import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const useTablet = () => {
  const theme = useMantineTheme();
  const { sm: tabletWidth } = theme.breakpoints;

  const isTablet = useMediaQuery(`(max-width: ${tabletWidth})`);
  return isTablet;
};

export default useTablet;
