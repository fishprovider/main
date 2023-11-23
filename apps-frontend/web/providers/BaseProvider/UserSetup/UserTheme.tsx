import storeUser from '@fishprovider/cross/dist/stores/user';
import moment from 'moment';
import { useEffect } from 'react';

function UserTheme() {
  useEffect(() => {
    const isNightTime = moment().hour() >= 18 || moment().hour() <= 6;
    setTimeout(() => {
      storeUser.mergeState({ theme: isNightTime ? 'dark' : 'light' });
    }, 5000);
  }, []);

  return null;
}

export default UserTheme;
