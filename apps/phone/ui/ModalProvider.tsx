import storeUser from '@fishprovider/cross/dist/stores/user';

import Sheet from './Sheet';

export default function ModalProvider() {
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

export const showModal = (content: React.ReactNode) => {
  storeUser.mergeState({ modalOpen: true, modalContent: content });
};
