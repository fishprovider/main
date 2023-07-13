import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import PushNotif from '~components/PushNotif';
import UserController from '~controllers/UserController';
import Button from '~ui/Button';
import View from '~ui/View';

const Drawer = createDrawerNavigator();

function DemoScreen() {
  const navigation = useNavigation<any>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button themeInverse onPress={() => navigation.toggleDrawer()}>
        Toggle Drawer
      </Button>
      <PushNotif />
    </View>
  );
}

export default function Wallet() {
  return (
    <UserController>
      <Drawer.Navigator>
        <Drawer.Screen name="Wallet" component={DemoScreen} />
        <Drawer.Screen name="Deposit" component={DemoScreen} />
        <Drawer.Screen name="Withdraw" component={DemoScreen} />
        <Drawer.Screen name="Transfer" component={DemoScreen} />
        <Drawer.Screen name="Invest" component={DemoScreen} />
      </Drawer.Navigator>
    </UserController>
  );
}
