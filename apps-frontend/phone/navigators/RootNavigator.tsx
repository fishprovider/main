import { createStackNavigator } from '@react-navigation/stack';

import BaseProvider from '~providers/BaseProvider';
import User from '~views/User';

import BottomTabsNavigator from './BottomTabsNavigator';

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <BaseProvider>
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
      </Stack.Navigator>
    </BaseProvider>
  );
}
