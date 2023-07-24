import { createDrawerNavigator } from '@react-navigation/drawer';

import DemoDrawer from '~components/DemoDrawer';
import UserController from '~controllers/UserController';
import User from '~views/User';

const Drawer = createDrawerNavigator();

export default function AccountNavigator() {
  return (
    <UserController>
      <Drawer.Navigator>
        <Drawer.Screen name="Trade" component={DemoDrawer} />
        <Drawer.Screen name="History" component={DemoDrawer} />
        <Drawer.Screen name="Admin" component={DemoDrawer} />
        <Drawer.Screen name="User" component={User} />
      </Drawer.Navigator>
    </UserController>
  );
}
