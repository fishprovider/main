import { ModalsProvider } from '@mantine/modals';
import type React from 'react';

interface Props {
  children: React.ReactNode;
}

function ModalProvider({ children }: Props) {
  return (
    <ModalsProvider>
      {children}
    </ModalsProvider>
  );
}

export default ModalProvider;
