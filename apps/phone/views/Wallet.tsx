/* eslint-disable no-alert */

import Device from 'expo-device';
import Notifications, { Notification } from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import Button from '~ui/Button';
import Text from '~ui/Text';
import View from '~ui/View';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken?: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // @ts-ignore global var
      alert('Failed to get push token for push notification!');
      return undefined;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    // @ts-ignore global var
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export default function Wallet() {
  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [notification, setNotification] = useState<Notification>();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    // @ts-ignore never undefined
    notificationListener.current = Notifications.addNotificationReceivedListener((event) => {
      setNotification(event);
    });
    // @ts-ignore never undefined
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
    // @ts-ignore never undefined
      Notifications.removeNotificationSubscription(notificationListener.current);
      // @ts-ignore never undefined
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
        disabled={!expoPushToken}
      >
        Press to Send Notification
      </Button>
    </View>
  );
}
