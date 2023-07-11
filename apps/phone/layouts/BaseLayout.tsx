/* eslint-disable react/no-unstable-nested-components */

import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Account from '~views/Account';
import Strategies from '~views/Strategies';
import Wallet from '~views/Wallet';

const Tab = createBottomTabNavigator();

export default function BaseLayout() {
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
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: (props) => <FontAwesome {...props} name="bar-chart" />,
        }}
      />
    </Tab.Navigator>
  );
}
