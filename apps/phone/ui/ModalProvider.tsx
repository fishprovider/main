import storeUser from '@fishprovider/cross/dist/stores/user';

import Sheet from './Sheet';

function DefaultModal() {
  const {
    modalOpen,
    modalContent,
  } = storeUser.useStore((state) => ({
    modalOpen: state.modalOpen,
    modalContent: state.modalContent,
  }));

  const onClose = () => {
    storeUser.mergeState({ modalOpen: false, modalContent: null });
  };

  return (
    <Sheet
      modal
      disableDrag
      open={modalOpen}
      onOpenChange={onClose}
    >
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame>{modalContent}</Sheet.Frame>
    </Sheet>
  );
}

interface Props {
  children: React.ReactNode;
}

export default function ModalProvider({ children }: Props) {
  return (
    <>
      {children}
      <DefaultModal />
    </>
  );
}

export const showModal = (content: React.ReactNode) => {
  storeUser.mergeState({ modalOpen: true, modalContent: content });
};
