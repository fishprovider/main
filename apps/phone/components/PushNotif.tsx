import storeUser from '@fishprovider/cross/stores/user';
import * as Device from 'expo-device';

import usePushNotif from '~hooks/usePushNotif';
import { sendPushNotif } from '~libs/pushNotif';
import Button from '~ui/Button';
import Text from '~ui/Text';
import View from '~ui/View';

function PushNotifDemo() {
  const expoPushToken = storeUser.useStore((state) => state.expoPushToken);

  const notification = usePushNotif();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Text>
        Your expo push token:
        {' '}
        {expoPushToken}
      </Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>
          Title:
          {' '}
          {notification && notification.request.content.title}
          {' '}
        </Text>
        <Text>
          Body:
          {' '}
          {notification && notification.request.content.body}
        </Text>
        <Text>
          Data:
          {' '}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
      <Button
        onPress={() => sendPushNotif(expoPushToken)}
        disabled={!expoPushToken}
      >
        Press to Send Notification
      </Button>
    </View>
  );
}

export default function PushNotif() {
  if (!Device.isDevice) return null;
  return <PushNotifDemo />;
}
