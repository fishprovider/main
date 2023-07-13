import promiseCreator from '@fishprovider/utils/helpers/promiseCreator';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

type Notification = Notifications.Notification;

let expoPushToken: string;
const expoPushTokenPromise = promiseCreator();

async function requestNotif() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token for push notification!');
    return finalStatus;
  }

  expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
  expoPushTokenPromise.resolveExec();

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return finalStatus;
}

async function initNotif() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  await requestNotif();
}

async function handleNotif() {
  await expoPushTokenPromise;
  const sub = Notifications.addNotificationReceivedListener((event) => {
    console.log(event);
  });
  const unsub = () => {
    Notifications.removeNotificationSubscription(sub);
  };
  return unsub;
}

async function sendNotif() {
  await expoPushTokenPromise;
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
  handleNotif,
  initNotif,
  requestNotif,
  sendNotif,
};

export type {
  Notification,
};
