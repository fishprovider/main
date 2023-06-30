import { Modal as MModal, ModalProps } from '@mantine/core';

interface Props extends ModalProps {
  children: React.ReactNode;
}

function Modal({ children, ...rest }: Props) {
  return (
    <MModal {...rest}>
      {children}
    </MModal>
  );
}

export default Modal;
