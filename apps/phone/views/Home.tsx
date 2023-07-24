/* eslint-disable react/no-unstable-nested-components */

import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Account from './Account';
import Strategies from './Strategies';
import Wallet from './Wallet';

const Tab = createBottomTabNavigator();

export default function Home() {
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
        component={Wallet}
        options={{
          tabBarIcon: (props) => <FontAwesome {...props} name="bank" />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: (props) => <FontAwesome {...props} name="bar-chart" />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
