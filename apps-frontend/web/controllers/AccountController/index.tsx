import storeUser from '@fishprovider/cross/dist/stores/user';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';

import StrategyController from '~controllers/StrategyController';
import UserController from '~controllers/UserController';

import AccountWatch from './AccountWatch';
import ActivityWatch from './ActivityWatch';

interface Props {
  providerId: string;
  children: React.ReactNode;
}

function AccountController({ providerId, children }: Props) {
  const roles = storeUser.useStore((state) => state.info?.roles);

  const { isViewerProvider } = getRoleProvider(roles, providerId);

  Logger.debug('[render] AccountController', providerId);
  return (
    <UserController title="Account">
      {isViewerProvider && (
        <StrategyController providerId={providerId}>
          <AccountWatch providerId={providerId} />
          <ActivityWatch />
          {children}
        </StrategyController>
      )}
    </UserController>
  );
}

export default AccountController;
