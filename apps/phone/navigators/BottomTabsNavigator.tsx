import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Strategies from '~views/Strategies';

import AccountNavigator from './AccountNavigator';
import WalletNavigator from './WalletNavigator';

const Tab = createBottomTabNavigator();

function StrategiesIcon(props: any) {
  return <FontAwesome {...props} name="rocket" />;
}

function BankIcon(props: any) {
  return <FontAwesome {...props} name="bank" />;
}

function AccountIcon(props: any) {
  return <FontAwesome {...props} name="bar-chart" />;
}

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Strategies"
        component={Strategies}
        options={{
          tabBarIcon: StrategiesIcon,
          tabBarStyle: { padding: 10 },
        }}
      />
      <Tab.Screen
        name="WalletNavigator"
        component={WalletNavigator}
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: BankIcon,
          tabBarStyle: { padding: 10 },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="AccountNavigator"
        component={AccountNavigator}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: AccountIcon,
          tabBarStyle: { padding: 10 },
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
