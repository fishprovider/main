import Favorite from '~components/account/Favorite';
import ProviderSelect from '~components/account/ProviderSelect';
import { watchUserInfoController } from '~controllers/user.controller';
import Group from '~ui/core/Group';

function ProviderBreadcrumbs() {
  const {
    providerId = '',
  } = watchUserInfoController((state) => ({
    providerId: state.activeAccount?._id,
  }));

  return (
    <Group>
      <ProviderSelect />
      <Favorite providerId={providerId} />
    </Group>
  );
}

export default ProviderBreadcrumbs;
