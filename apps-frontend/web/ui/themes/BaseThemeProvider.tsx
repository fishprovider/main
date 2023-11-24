import { MantineProvider } from '@mantine/core';

import { watchUserInfoController } from '~controllers/user.controller';

interface Props {
  children: React.ReactNode;
}

function BaseThemeProvider({ children }: Props) {
  const { userTheme } = watchUserInfoController((state) => ({
    userTheme: state.theme,
  }));

  return (
    <MantineProvider
      theme={{
        colorScheme: userTheme === 'dark' ? 'dark' : 'light',
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      {children}
    </MantineProvider>
  );
}

export default BaseThemeProvider;
