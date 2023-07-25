import { createStackNavigator } from '@react-navigation/stack';

import User from '~views/User';

import WalletNavigator from './WalletNavigator';

const Stack = createStackNavigator();

export default function UserWalletNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Wallet"
        component={WalletNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="User"
        component={User}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
