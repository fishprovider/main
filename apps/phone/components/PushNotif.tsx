import * as Device from 'expo-device';

import { sendNotif } from '~libs/pushNotif';
import Button from '~ui/Button';
import View from '~ui/View';

function PushNotifDemo() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Button onPress={() => sendNotif()}>
        Press to Send Notification
      </Button>
    </View>
  );
}

export default function PushNotif() {
  if (!Device.isDevice) return null;
  return <PushNotifDemo />;
}
