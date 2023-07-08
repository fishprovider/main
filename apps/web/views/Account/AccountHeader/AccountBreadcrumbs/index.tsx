import storeUser from '@fishprovider/cross/stores/user';

import Favorite from '~components/account/Favorite';
import LockAction from '~components/account/LockAction';
import ProviderSelect from '~components/account/ProviderSelect';
import Group from '~ui/core/Group';

function AccountBreadcrumbs() {
  const {
    providerId = '',
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
  }));

  return (
    <Group>
      <ProviderSelect />
      <Group spacing={0}>
        <Favorite providerId={providerId} />
        <LockAction providerId={providerId} />
      </Group>
    </Group>
  );
}

export default AccountBreadcrumbs;
