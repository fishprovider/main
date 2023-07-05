import { Stack } from 'expo-router';

import BaseController from '~controllers/BaseController';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function BaseLayout() {
  return (
    <BaseController>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </BaseController>
  );
}
