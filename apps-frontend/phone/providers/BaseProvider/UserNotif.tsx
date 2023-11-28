import { useEffect } from 'react';

import { watchUserInfoController } from '~controllers/user.controller';
import { handleNotif, subNotif } from '~libs/pushNotif';

function UserNotif() {
  const {
    isClientLoggedIn,
    isServerLoggedIn,
  } = watchUserInfoController((state) => ({
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
