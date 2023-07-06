import {
  Toast,
  ToastProvider as ToastProviderT,
  ToastViewport,
  useToastController as useToast,
  useToastState,
} from '@tamagui/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Stack from './Stack';

interface Props {
  children: React.ReactNode;
}

function CurrentToast() {
  const currentToast = useToastState();

  if (!currentToast || currentToast.isHandledNatively) return null;

  return (
    <Toast>
      <Stack>
        <Toast.Title>{currentToast.title}</Toast.Title>
        {!!currentToast.message && (
          <Toast.Description>{currentToast.message}</Toast.Description>
        )}
      </Stack>
    </Toast>
  );
}

function SafeToastViewport() {
  const { left, top, right } = useSafeAreaInsets();
  return (
    <ToastViewport top={top} left={left} right={right} />
  );
}

export default function ToastProvider({ children }: Props) {
  return (
    <ToastProviderT>
      <CurrentToast />
      <SafeToastViewport />
      {children}
    </ToastProviderT>
  );
}

export {
  useToast,
  useToastState,
};
