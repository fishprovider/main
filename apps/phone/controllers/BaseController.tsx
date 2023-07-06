import { QueryProvider } from '@fishbot/cross/libs/query';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

import ThemeProvider from '~ui/ThemeProvider';

import { initialize as initServices } from './baseServices';

initServices();

interface Props {
  children: React.ReactNode;
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function BaseController({ children }: Props) {
  const [loaded, error] = useFonts({
    FontAwesome: require('../assets/fonts/FontAwesome.ttf'),
    Inter: require('../assets/fonts/Inter-Medium.otf'),
    InterBold: require('../assets/fonts/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <QueryProvider withDevTools={false}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
}

export { ErrorBoundary } from 'expo-router';
