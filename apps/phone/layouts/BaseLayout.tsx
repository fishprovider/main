import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Account from '~views/Account';
import Invest from '~views/Invest';
import Wallet from '~views/Wallet';

const Tab = createBottomTabNavigator();

export default function BaseLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Invest"
        component={Invest}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
      />
      <Tab.Screen
        name="Account"
        component={Account}
      />
    </Tab.Navigator>
  );
}
