import { useMutate } from '@fishprovider/cross/dist/libs/query';

import { updateAccountController } from '~controllers/account.controller';
import { watchUserInfoController } from '~controllers/user.controller';
import Icon from '~ui/core/Icon';
import openConfirmModal from '~ui/modals/openConfirmModal';

interface Props {
  email: string
}

function RemoveMember({ email }: Props) {
  const {
    accountId = '',
  } = watchUserInfoController((state) => ({
    accountId: state.activeAccount?._id,
  }));

  const { mutate: remove, isLoading: isLoadingRemove } = useMutate({
    mutationFn: () => updateAccountController({
      accountId,
    }, {
      removeMemberEmail: email,
    }),
  });

  const onRemove = async () => {
    if (!(await openConfirmModal())) return;

    remove();
  };

  return (
    <Icon name="Delete" size="small" button onClick={() => onRemove()} loading={isLoadingRemove} tooltip="Remove user" />
  );
}

export default RemoveMember;
