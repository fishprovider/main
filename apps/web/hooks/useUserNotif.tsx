import storeUser from '@fishprovider/cross/stores/user';
import { useEffect } from 'react';

import { handleNotif, initNotif, subNotif } from '~libs/pushNotif';
import { toastInfo } from '~ui/toast';

function useUserNotif() {
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
}

export default useUserNotif;
