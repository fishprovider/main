import Favorite from '~components/account/Favorite';
import LockAction from '~components/account/LockAction';
import ProviderSelect from '~components/account/ProviderSelect';
import { watchUserInfoController } from '~controllers/user.controller';
import Group from '~ui/core/Group';

function AccountBreadcrumbs() {
  const {
    providerId = '',
  } = watchUserInfoController((state) => ({
    providerId: state.activeAccount?._id,
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
