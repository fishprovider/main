import * as Device from 'expo-device';

import { sendNotif } from '~libs/pushNotif';
import Button from '~ui/Button';

export default function PushNotifDemo() {
  return (
    <Button onPress={() => {
      if (!Device.isDevice) return;
      sendNotif();
    }}
    >
      Press to Send Notification
    </Button>
  );
}
