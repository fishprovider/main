import storeUser from '@fishprovider/cross/dist/stores/user';
import { useEffect } from 'react';

import { identifyLiveChat } from '~libs/liveChat';

function UserLiveChat() {
  const {
    isClientLoggedIn,
    user,
  } = storeUser.useStore((state) => ({
    isClientLoggedIn: state.isClientLoggedIn,
    user: state.info,
  }));

  useEffect(() => {
    if (isClientLoggedIn && user) {
      identifyLiveChat(user);
    }
  }, [isClientLoggedIn, user]);

  return null;
}

export default UserLiveChat;
