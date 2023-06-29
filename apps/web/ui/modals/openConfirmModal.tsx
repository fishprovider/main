import { modals } from '@mantine/modals';

interface ConfirmModalParams {
  useNativeConfirm?: boolean;
  title?: string;
  labels?: Record<'confirm' | 'cancel', React.ReactNode>;
  content?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const openConfirmModal = (params: ConfirmModalParams = {}) => {
  const {
    useNativeConfirm = true,
    title = 'Are you sure?',
    labels = { confirm: 'Confirm', cancel: 'Cancel' },
    content = null,
    onCancel = () => undefined,
    onConfirm = () => undefined,
  } = params;

  // eslint-disable-next-line no-restricted-globals, no-alert
  if (useNativeConfirm) return confirm(title);

  return new Promise<boolean>((resolve) => {
    modals.openConfirmModal({
      title,
      labels,
      children: content,
      onCancel: () => {
        onCancel();
        resolve(false);
      },
      onConfirm: () => {
        onConfirm();
        resolve(true);
      },
    });
  });
};

export default openConfirmModal;
