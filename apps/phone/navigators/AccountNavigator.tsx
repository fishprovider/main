import { FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import UserController from '~controllers/UserController';
import DemoDrawer from '~views/DemoDrawer';
import Trade from '~views/Trade';

const Drawer = createDrawerNavigator();

function UserIcon() {
  const navigation = useNavigation<any>();
  return (
    <FontAwesome
      name="user"
      size={20}
      style={{ marginRight: 15, color: 'green' }}
      onPress={() => navigation.navigate('User')}
    />
  );
}

export default function AccountNavigator() {
  return (
    <UserController>
      <Drawer.Navigator>
        <Drawer.Screen
          name="Trade"
          component={Trade}
          options={{
            headerRight: UserIcon,
          }}
        />
        <Drawer.Screen
          name="History"
          component={DemoDrawer}
          options={{
            headerRight: UserIcon,
          }}
        />
        <Drawer.Screen
          name="Admin"
          component={DemoDrawer}
          options={{
            headerRight: UserIcon,
          }}
        />
      </Drawer.Navigator>
    </UserController>
  );
}
