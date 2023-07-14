import storeUser from '@fishprovider/cross/dist/stores/user';
import { useEffect } from 'react';

import { identifyLiveChat } from '~libs/liveChat';

const useLiveChat = () => {
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
};

export default useLiveChat;
