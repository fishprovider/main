import { useEffect } from 'react';

import { handleNotif } from '~libs/pushNotif';

function usePushNotif() {
  useEffect(() => {
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
