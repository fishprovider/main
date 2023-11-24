import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import { useEffect } from 'react';

import { updateUserInfoController, watchUserInfoController } from '~controllers/user.controller';

interface Props {
  children: React.ReactNode;
}

function AdminProvider({ children }: Props) {
  const roles = watchUserInfoController((state) => state.activeUser?.roles);

  const { isManagerWeb } = getRoleProvider(roles);

  Logger.debug('[render] AdminProvider', isManagerWeb);

  useEffect(() => {
    if (isManagerWeb) {
      updateUserInfoController({ activeAccount: undefined });
    }
  }, [isManagerWeb]);

  if (!isManagerWeb) return null;

  return (
    <div>
      {children}
    </div>
  );
}

export default AdminProvider;
