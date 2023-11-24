import moment from 'moment';
import { useEffect } from 'react';

import { updateUserInfoController } from '~controllers/user.controller';

function UserTheme() {
  useEffect(() => {
    const isNightTime = moment().hour() >= 18 || moment().hour() <= 6;
    setTimeout(() => {
      updateUserInfoController({ theme: isNightTime ? 'dark' : 'light' });
    }, 5000);
  }, []);

  return null;
}

export default UserTheme;
