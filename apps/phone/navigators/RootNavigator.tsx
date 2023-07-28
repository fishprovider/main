import { createStackNavigator } from '@react-navigation/stack';

import OpenOrder from '~components/OpenOrder';
import BaseController from '~controllers/BaseController';
import User from '~views/User';

import BottomTabsNavigator from './BottomTabsNavigator';

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <BaseController>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={BottomTabsNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="User"
          component={User}
          options={{
            headerLeftLabelVisible: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="OpenOrder"
          component={OpenOrder}
          options={{
            headerLeftLabelVisible: false,
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </BaseController>
  );
}
