import { QueryProvider } from '@fishbot/cross/libs/query';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

import ThemeProvider from '~ui/ThemeProvider';
import ToastProvider from '~ui/ToastProvider';

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

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Keep the splash screen open until the assets have loaded. In the future,
  // we should just support async font loading with a native version of font-display.
  if (!loaded) return <SplashScreen />;

  return (
    <QueryProvider withDevTools={false}>
      <ThemeProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export { ErrorBoundary } from 'expo-router';
