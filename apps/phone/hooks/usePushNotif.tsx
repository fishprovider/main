import { useEffect, useState } from 'react';

import type { Notification } from '~libs/pushNotif';
import { subPushNotif } from '~libs/pushNotif';

function usePushNotif() {
  const [notification, setNotification] = useState<Notification>();

  useEffect(() => {
    const unsub = subPushNotif((event) => setNotification(event));
    return unsub;
  }, []);

  return notification;
}

export default usePushNotif;
