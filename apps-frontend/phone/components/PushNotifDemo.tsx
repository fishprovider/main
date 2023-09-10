import * as Device from 'expo-device';

import { sendNotif } from '~libs/pushNotif';
import Button from '~ui/Button';

export default function PushNotifDemo() {
  const onSend = () => {
    if (!Device.isDevice) return;
    sendNotif();
  };

  return (
    <Button onPress={onSend}>
      Test Push Notification
    </Button>
  );
}
