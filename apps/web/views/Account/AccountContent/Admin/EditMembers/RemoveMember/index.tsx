import memberRemove from '@fishprovider/cross/api/accounts/members/remove';
import { useMutate } from '@fishprovider/cross/libs/query';
import storeUser from '@fishprovider/cross/stores/user';

import Icon from '~ui/core/Icon';
import openConfirmModal from '~ui/modals/openConfirmModal';

interface Props {
  email: string
}

function RemoveMember({ email }: Props) {
  const {
    providerId = '',
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
  }));

  const { mutate: remove, isLoading: isLoadingRemove } = useMutate({
    mutationFn: memberRemove,
  });

  const onRemove = async () => {
    if (!(await openConfirmModal())) return;

    remove({ providerId, email });
  };

  return (
    <Icon name="Delete" size="small" button onClick={() => onRemove()} loading={isLoadingRemove} tooltip="Remove user" />
  );
}

export default RemoveMember;
