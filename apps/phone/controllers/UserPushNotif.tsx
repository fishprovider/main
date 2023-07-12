import storeUser from '@fishprovider/cross/stores/user';
import { useEffect } from 'react';

import { registerPushNotif } from '~libs/pushNotif';

function UserPushNotif() {
  useEffect(() => {
    registerPushNotif().then((expoPushToken) => {
      storeUser.mergeState({ expoPushToken });
      // TODO: save DB
    });
  }, []);

  return null;
}

export default UserPushNotif;
