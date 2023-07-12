import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

type Notification = Notifications.Notification;

async function initPushNotif() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

async function registerPushNotif() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token for push notification!');
    return undefined;
  }
  const token = (await Notifications.getExpoPushTokenAsync()).data;

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

function subPushNotif(onNotif: (event: Notification) => void) {
  const sub = Notifications.addNotificationReceivedListener((event) => {
    onNotif(event);
  });
  const unsub = () => {
    Notifications.removeNotificationSubscription(sub);
  };
  return unsub;
}

async function sendPushNotif(expoPushToken?: string) {
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

export {
  initPushNotif,
  registerPushNotif,
  sendPushNotif,
  subPushNotif,
};

export type {
  Notification,
};
