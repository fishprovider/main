import storeUser from '@fishbot/cross/stores/user';
import { getRoleProvider } from '@fishbot/utils/helpers/user';
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

function AdminController({ children }: Props) {
  const roles = storeUser.useStore((state) => state.info?.roles);

  const { isManagerWeb } = getRoleProvider(roles);

  Logger.debug('[render] AdminController', isManagerWeb);

  useEffect(() => {
    if (isManagerWeb) {
      storeUser.mergeState({ activeProvider: undefined });
    }
  }, [isManagerWeb]);

  if (!isManagerWeb) return null;

  return (
    <div>
      {children}
    </div>
  );
}

export default AdminController;
