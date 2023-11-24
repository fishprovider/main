import memberRemove from '@fishprovider/cross/dist/api/accounts/members/remove';
import { useMutate } from '@fishprovider/cross/dist/libs/query';

import { watchUserInfoController } from '~controllers/user.controller';
import Icon from '~ui/core/Icon';
import openConfirmModal from '~ui/modals/openConfirmModal';

interface Props {
  email: string
}

function RemoveMember({ email }: Props) {
  const {
    providerId = '',
  } = watchUserInfoController((state) => ({
    providerId: state.activeAccount?._id,
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
