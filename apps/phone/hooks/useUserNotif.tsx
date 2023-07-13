import { useEffect } from 'react';

import { handleNotif, subNotif } from '~libs/pushNotif';

function usePushNotif() {
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
}

export default usePushNotif;
