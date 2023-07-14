import storeUser from '@fishprovider/cross/dist/stores/user';
import { useEffect } from 'react';

import { connectSocket, disconnectSocket } from '~libs/socket';

const useSocket = () => {
  const {
    isServerLoggedIn,
  } = storeUser.useStore((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
  }));

  useEffect(() => {
    if (isServerLoggedIn) {
      connectSocket();
    } else {
      disconnectSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, [isServerLoggedIn]);
};

export default useSocket;
