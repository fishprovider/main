// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { useNavigation } from '@react-navigation/native';
// import { Button, View } from 'react-native';

import PushNotif from '~components/PushNotif';
import UserController from '~controllers/UserController';

// const Drawer = createDrawerNavigator();

// function HomeScreen() {
//   const navigation = useNavigation<any>();
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Button
//         onPress={() => navigation.toggleDrawer()}
//         title="Toggle Drawer"
//       />
//     </View>
//   );
// }

// function NotificationsScreen() {
//   const navigation = useNavigation<any>();
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Button
//         onPress={() => navigation.toggleDrawer()}
//         title="Toggle Drawer"
//       />
//     </View>
//   );
// }

export default function Wallet() {
  return (
    <UserController>
      <PushNotif />
      {/* <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator> */}
    </UserController>
  );
}
