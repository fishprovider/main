import storeUser from '@fishprovider/cross/dist/stores/user';
import { useEffect } from 'react';

import { handleNotif, subNotif } from '~libs/pushNotif';

function UserNotif() {
  const {
    isClientLoggedIn,
    isServerLoggedIn,
  } = storeUser.useStore((state) => ({
    isClientLoggedIn: state.isClientLoggedIn,
    isServerLoggedIn: state.isServerLoggedIn,
  }));

  useEffect(() => {
    let unsub: () => void;
    if (isClientLoggedIn) {
      handleNotif().then((res) => {
        unsub = res;
      });
    }
    return () => {
      if (unsub) unsub();
    };
  }, [isClientLoggedIn]);

  useEffect(() => {
    if (isServerLoggedIn) {
      subNotif();
    }
  }, [isServerLoggedIn]);

  return null;
}

export default UserNotif;
