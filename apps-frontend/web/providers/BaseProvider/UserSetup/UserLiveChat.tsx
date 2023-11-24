import { useEffect } from 'react';

import { watchUserInfoController } from '~controllers/user.controller';
import { identifyLiveChat } from '~libs/liveChat';

function UserLiveChat() {
  const {
    isClientLoggedIn,
    user,
  } = watchUserInfoController((state) => ({
    isClientLoggedIn: state.isClientLoggedIn,
    user: state.activeUser,
  }));

  useEffect(() => {
    if (isClientLoggedIn && user) {
      identifyLiveChat(user);
    }
  }, [isClientLoggedIn, user]);

  return null;
}

export default UserLiveChat;
