import { ModalProvider, useModal } from 'react-native-use-modal-hooks';

import Button from './Button';
import Dialog from './Dialog';

interface Props {
  title?: React.ReactNode;
  description?: React.ReactNode;
  content?: React.ReactNode;
}

const useModalSimple = ({
  title,
  description,
  content,
}: Props) => {
  const [show, hide] = useModal(() => (
    <Dialog open modal={false}>
      <Dialog.Portal>
        <Dialog.Content
          key="content" // need this otherwise the dialog will raise an warn of AnimatePresence
          width="98%"
          space
          borderWidth={2}
          borderColor="black"
          style={{
            position: 'absolute',
            top: '20%',
            left: '1%',
            right: '1%',
          }}
        >
          {title && <Dialog.Title>{title}</Dialog.Title>}
          {description && <Dialog.Description>{description}</Dialog.Description>}
          {content}
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
