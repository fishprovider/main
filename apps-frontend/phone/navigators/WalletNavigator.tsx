import { createDrawerNavigator } from '@react-navigation/drawer';

import UserNav from '~components/UserNav';
import UserController from '~controllers/UserController';
import DemoDrawer from '~views/DemoDrawer';

const Drawer = createDrawerNavigator();

export default function WalletNavigator() {
  return (
    <UserController>
      <Drawer.Navigator screenOptions={{
        headerRight: UserNav,
        sceneContainerStyle: {
          paddingBottom: 45,
        },
      }}
      >
        <Drawer.Screen
          name="Wallet"
          component={DemoDrawer}
        />
        <Drawer.Screen
          name="Deposit"
          component={DemoDrawer}
        />
        <Drawer.Screen
          name="Withdraw"
          component={DemoDrawer}
        />
        <Drawer.Screen
          name="Transfer"
          component={DemoDrawer}
        />
        <Drawer.Screen
          name="Invest"
          component={DemoDrawer}
        />
      </Drawer.Navigator>
    </UserController>
  );
}
