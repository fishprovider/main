import { createStackNavigator } from '@react-navigation/stack';

import User from '~views/User';

import AccountNavigator from './AccountNavigator';

const Stack = createStackNavigator();

export default function UserAccountNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AccountNavigator"
        component={AccountNavigator}
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
  );
}
