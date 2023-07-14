import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import PushNotifDemo from '~components/PushNotifDemo';
import UserController from '~controllers/UserController';
import Button from '~ui/Button';
import Stack from '~ui/Stack';

const Drawer = createDrawerNavigator();

function DemoScreen() {
  const navigation = useNavigation<any>();
  return (
    <Stack space="$4" paddingTop="$4" alignItems="center">
      <Button themeInverse onPress={() => navigation.toggleDrawer()}>
        Toggle Drawer
      </Button>
      <PushNotifDemo />
    </Stack>
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
