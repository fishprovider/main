import { useEffect } from 'react';

import { watchUserInfoController } from '~controllers/user.controller';
import { identifyAnalytics } from '~libs/analytics';
import { isTrack } from '~utils';

function UserAnalytics() {
  const {
    isClientLoggedIn,
    user,
  } = watchUserInfoController((state) => ({
    isClientLoggedIn: state.isClientLoggedIn,
    user: state.activeUser,
  }));

  useEffect(() => {
    if (isClientLoggedIn && user && isTrack) {
      identifyAnalytics(user);
    }
  }, [isClientLoggedIn, user]);

  return null;
}

export default UserAnalytics;
