import storeUser from '@fishprovider/cross/dist/stores/user';
import { useEffect, useState } from 'react';

import { requestNotif } from '~libs/pushNotif';
import Box from '~ui/core/Box';
import Icon from '~ui/core/Icon';
import openConfirmModal from '~ui/modals/openConfirmModal';

function PushNotificationButton() {
  const isClientLoggedIn = storeUser.useStore((state) => state.isClientLoggedIn);

  const [status, setStatus] = useState('');

  useEffect(() => {
    if (isClientLoggedIn) {
      requestNotif().then((res) => {
        if (res !== 'denied') setStatus(res);
      });
    }
  }, [isClientLoggedIn]);

  if (!isClientLoggedIn || ['granted', 'denied', 'unsupported'].includes(status)) return null;

  const onClick = async () => {
    if (!(await openConfirmModal({
      title: 'Allow notifications?',
    }))) return;

    const res = await requestNotif();
    setStatus(res);
  };

  return (
    <Box sx={{
      position: 'fixed',
      bottom: '6rem',
      right: '1rem',
    }}
    >
      <Icon name="Notifications" button onClick={onClick} />
    </Box>
  );
}

export default PushNotificationButton;
