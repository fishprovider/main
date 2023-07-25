import { useEffect } from 'react';

import { handleNotif, subNotif } from '~libs/pushNotif';

function UserNotif() {
  useEffect(() => {
    subNotif();

    let unsub: () => void;
    handleNotif().then((res) => {
      unsub = res;
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  return null;
}

export default UserNotif;
