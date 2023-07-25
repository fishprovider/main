import storeUser from '@fishprovider/cross/dist/stores/user';
import { useEffect } from 'react';

import { handleNotif, initNotif, subNotif } from '~libs/pushNotif';
import { toastInfo } from '~ui/toast';

function UserNotif() {
  const {
    isClientLoggedIn,
    isServerLoggedIn,
  } = storeUser.useStore((state) => ({
    isClientLoggedIn: state.isClientLoggedIn,
    isServerLoggedIn: state.isServerLoggedIn,
  }));

  useEffect(() => {
    if (isClientLoggedIn) {
      initNotif();
      handleNotif((title: string, body: string) => {
        Logger.info('NotifHandler', title, body);
        toastInfo({ title, message: body });
      });
    }
  }, [isClientLoggedIn]);

  useEffect(() => {
    if (isServerLoggedIn) {
      subNotif();
    }
  }, [isServerLoggedIn]);

  return null;
}

export default UserNotif;
