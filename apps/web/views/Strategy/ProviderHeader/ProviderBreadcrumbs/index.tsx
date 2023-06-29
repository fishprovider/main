import storeUser from '@fishbot/cross/stores/user';

import Favorite from '~components/account/Favorite';
import ProviderSelect from '~components/account/ProviderSelect';
import Group from '~ui/core/Group';

function ProviderBreadcrumbs() {
  const {
    providerId = '',
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
  }));

  return (
    <Group>
      <ProviderSelect />
      <Favorite providerId={providerId} />
    </Group>
  );
}

export default ProviderBreadcrumbs;
