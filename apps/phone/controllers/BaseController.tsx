import { QueryProvider } from '@fishbot/cross/libs/query';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { TamaguiProvider, Theme } from 'tamagui';

import config from '../tamagui.config';
import { initialize as initServices } from './baseServices';

initServices();

interface Props {
  children: React.ReactNode;
}

export default function BaseController({ children }: Props) {
  const [loaded, error] = useFonts({
    FontAwesome: require('../assets/fonts/FontAwesome.ttf'),
    Inter: require('../assets/fonts/Inter-Medium.otf'),
    InterBold: require('../assets/fonts/Inter-Bold.otf'),
  });

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Keep the splash screen open until the assets have loaded. In the future,
  // we should just support async font loading with a native version of font-display.
  if (!loaded) return <SplashScreen />;

  return (
    <QueryProvider withDevTools={false}>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <TamaguiProvider config={config}>
          <Theme name={isDark ? 'dark' : 'light'}>
            {children}
          </Theme>
        </TamaguiProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export { ErrorBoundary } from 'expo-router';
