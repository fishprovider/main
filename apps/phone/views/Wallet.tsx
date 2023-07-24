import { createDrawerNavigator } from '@react-navigation/drawer';

import DemoDrawer from '~components/DemoDrawer';
import UserController from '~controllers/UserController';

const Drawer = createDrawerNavigator();

export default function Wallet() {
  return (
    <UserController>
      <Drawer.Navigator>
        <Drawer.Screen name="Wallet" component={DemoDrawer} />
        <Drawer.Screen name="Deposit" component={DemoDrawer} />
        <Drawer.Screen name="Withdraw" component={DemoDrawer} />
        <Drawer.Screen name="Transfer" component={DemoDrawer} />
        <Drawer.Screen name="Invest" component={DemoDrawer} />
      </Drawer.Navigator>
    </UserController>
  );
}
