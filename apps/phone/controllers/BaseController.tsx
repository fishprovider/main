import { QueryProvider } from '@fishprovider/cross/libs/query';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ThemeProvider from '~ui/ThemeProvider';

import { initialize as initServices } from './baseServices';
import UserSetup from './UserSetup';

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

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) return null;

  return (
    <QueryProvider withDevTools={false}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationContainer>
            <UserSetup />
            {children}
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryProvider>
  );
}
