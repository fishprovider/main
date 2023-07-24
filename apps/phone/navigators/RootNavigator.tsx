/* eslint-disable react/no-unstable-nested-components */

import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Strategies from '~views/Strategies';

import AccountNavigator from './AccountNavigator';
import WalletNavigator from './WalletNavigator';

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Strategies"
        component={Strategies}
        options={{
          tabBarIcon: (props) => <FontAwesome {...props} name="rocket" />,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletNavigator}
        options={{
          tabBarIcon: (props) => <FontAwesome {...props} name="bank" />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountNavigator}
        options={{
          tabBarIcon: (props) => <FontAwesome {...props} name="bar-chart" />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
