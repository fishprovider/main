import { createDrawerNavigator } from '@react-navigation/drawer';

import UserNav from '~components/UserNav';
import UserController from '~controllers/UserController';
import DemoDrawer from '~views/DemoDrawer';
import Trade from '~views/Trade';

const Drawer = createDrawerNavigator();

export default function AccountNavigator() {
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
          name="Trade"
          component={Trade}
        />
        <Drawer.Screen
          name="History"
          component={DemoDrawer}
        />
        <Drawer.Screen
          name="Admin"
          component={DemoDrawer}
        />
      </Drawer.Navigator>
    </UserController>
  );
}
