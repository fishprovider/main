import { updateUserInfoController, watchUserInfoController } from '~controllers/user.controller';

import Sheet from './Sheet';

export default function ModalProvider() {
  const {
    modalOpen,
    modalContent,
  } = watchUserInfoController((state) => ({
    modalOpen: state.modalOpen,
    modalContent: state.modalContent,
  }));

  const onClose = () => {
    updateUserInfoController({ modalOpen: false, modalContent: null });
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
  updateUserInfoController({ modalOpen: true, modalContent: content });
};
