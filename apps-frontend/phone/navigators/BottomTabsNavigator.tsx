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
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          paddingBottom: 20,
          paddingTop: 10,
          height: 80,
        },
      }}
    >
      <Tab.Screen
        name="Strategies"
        component={Strategies}
        options={{
          tabBarIcon: StrategiesIcon,
        }}
      />
      <Tab.Screen
        name="WalletNavigator"
        component={WalletNavigator}
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: BankIcon,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="AccountNavigator"
        component={AccountNavigator}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: AccountIcon,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
