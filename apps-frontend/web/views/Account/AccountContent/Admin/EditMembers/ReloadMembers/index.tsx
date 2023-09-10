import memberFetch from '@fishprovider/cross/dist/api/accounts/members/fetch';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import storeUser from '@fishprovider/cross/dist/stores/user';

import Icon from '~ui/core/Icon';

function ReloadMembers() {
  const {
    providerId = '',
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
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
