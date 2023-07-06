import {
  // Toast,
  ToastProvider as ToastProviderT,
  // ToastViewport,
  useToastController as useToast,
} from '@tamagui/toast';

interface Props {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: Props) {
  return (
    <ToastProviderT>
      {/* <Toast>
        <Toast.Title />
        <Toast.Description />
        <Toast.Action />
        <Toast.Close />
      </Toast> */}
      {/* <ToastViewport /> */}
      {children}
    </ToastProviderT>
  );
}

export {
  useToast,
};
