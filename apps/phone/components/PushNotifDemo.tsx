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
      Press to Send Notification
    </Button>
  );
}
