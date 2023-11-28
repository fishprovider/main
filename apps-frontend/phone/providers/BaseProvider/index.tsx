import { QueryProvider } from '@fishprovider/cross/dist/libs/query';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import BaseThemeProvider from '~ui/BaseThemeProvider';
import ModalProvider from '~ui/ModalProvider';
import ToastProvider from '~ui/ToastProvider';

import { initialize as initServices } from './baseServices';
import UserSetup from './UserSetup';

interface Props {
  children: React.ReactNode;
}

export default function BaseProvider({ children }: Props) {
  const [loadedFont, errorFont] = useFonts({
    FontAwesome: require('../../assets/fonts/FontAwesome.ttf'),
    Inter: require('../../assets/fonts/Inter-Medium.otf'),
    InterBold: require('../../assets/fonts/Inter-Bold.otf'),
  });

  const [loadedServices, setLoadedServices] = useState<{ loaded?: boolean, error?: any }>({});

  useEffect(() => {
    initServices()
      .then(() => setLoadedServices({ loaded: true }))
      .catch((error) => setLoadedServices({ error }));
  }, []);

  useEffect(() => {
    if (errorFont) throw errorFont;
  }, [errorFont]);

  useEffect(() => {
    if (loadedServices.error) throw loadedServices.error;
  }, [loadedServices.error]);

  if (!loadedFont || !loadedServices.loaded) return null;

  return (
    <QueryProvider withDevTools={false}>
      <SafeAreaProvider>
        <BaseThemeProvider>
          <NavigationContainer>
            <ToastProvider>
              <ModalProvider />
              <UserSetup />
              {children}
            </ToastProvider>
          </NavigationContainer>
        </BaseThemeProvider>
      </SafeAreaProvider>
    </QueryProvider>
  );
}
