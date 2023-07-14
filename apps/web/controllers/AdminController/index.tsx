import storeUser from '@fishprovider/cross/dist/stores/user';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
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
