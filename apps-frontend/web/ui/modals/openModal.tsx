import { modals } from '@mantine/modals';
import { cloneElement } from 'react';

interface ModalParams {
  title?: React.ReactNode,
  content?: JSX.Element,
  size?: string,
}

const openModal = (params: ModalParams) => {
  const {
    title = '',
    content = null,
    size = 'auto',
  } = params;

  const modalId = 'modal';
  const onClose = () => modals.close(modalId);

  modals.open({
    modalId,
    title,
    children: content && cloneElement(content, { onClose }),
    size,
  });
};

export default openModal;
