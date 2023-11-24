import memberFetch from '@fishprovider/cross/dist/api/accounts/members/fetch';
import { useMutate } from '@fishprovider/cross/dist/libs/query';

import { watchUserInfoController } from '~controllers/user.controller';
import Icon from '~ui/core/Icon';

function ReloadMembers() {
  const {
    providerId = '',
  } = watchUserInfoController((state) => ({
    providerId: state.activeAccount?._id,
  }));

  const { mutate: reload, isLoading: isLoadingReload } = useMutate({
    mutationFn: memberFetch,
  });

  const onReload = () => reload({ providerId });

  return (
    <Icon name="Sync" size="small" button onClick={onReload} loading={isLoadingReload} />
  );
}

export default ReloadMembers;
