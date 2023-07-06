import { ModalProvider, useModal } from 'react-native-use-modal-hooks';

import Button from './Button';
import Dialog from './Dialog';

interface Props {
  title: React.ReactNode;
  description: React.ReactNode;
}

const useModalSimple = ({
  title,
  description,
}: Props) => {
  const [show, hide] = useModal(() => (
    <Dialog open>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
        />
        <Dialog.Content
          key="content" // need this otherwise the dialog will raise an warn of AnimatePresence
          width="100%"
          space
        >
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
          <Dialog.Close asChild>
            <Button
              position="absolute"
              top="$3"
              right="$3"
              size="$2"
              circular
              onPress={() => hide()}
            >
              x
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  ));
  return [show, hide];
};

export {
  ModalProvider,
  useModal,
  useModalSimple,
};
