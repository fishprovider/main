import storeUser from '@fishbot/cross/stores/user';
import { MantineProvider } from '@mantine/core';

interface Props {
  children: React.ReactNode;
}

function BaseThemeProvider({ children }: Props) {
  const { userTheme } = storeUser.useStore((state) => ({
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
