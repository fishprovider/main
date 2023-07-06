import { ModalProvider, useModal } from 'react-native-use-modal-hooks';

import Dialog from './Dialog';

interface Props {
  title: React.ReactNode;
  description: React.ReactNode;
}

const useModalSimple = ({
  title,
  description,
}: Props) => useModal(() => (
  <Dialog open>
    <Dialog.Portal>
      <Dialog.Content>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog>
));

export {
  ModalProvider,
  useModal,
  useModalSimple,
};
