import { useEffect } from 'react';

import { watchUserInfoController } from '~controllers/user.controller';
import { connectSocket, disconnectSocket } from '~libs/socket';

function UserSocket() {
  const {
    isServerLoggedIn,
  } = watchUserInfoController((state) => ({
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

  return null;
}

export default UserSocket;
