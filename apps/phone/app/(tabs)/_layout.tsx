import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';

import Colors from '../../constants/Colors';

interface IconProps {
  color: string;
}

function TradeTabIcon({ color }: IconProps) {
  return (
    <FontAwesome
      name="bar-chart"
      size={20}
      color={color}
    />
  );
}

function InvestTabIcon({ color }: IconProps) {
  return (
    <MaterialIcons
      name="account-balance-wallet"
      size={20}
      color={color}
    />
  );
}

function UserTabIcon({ color }: IconProps) {
  return (
    <FontAwesome
      name="user"
      size={20}
      color={color}
    />
  );
}

function HeaderRight() {
  const colorScheme = useColorScheme();
  return (
    <Link href="/modal" asChild>
      <Pressable>
        {({ pressed }) => (
          <FontAwesome
            name="info-circle"
            size={25}
            color={Colors[colorScheme ?? 'light'].text}
            style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          />
        )}
      </Pressable>
    </Link>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trade',
          tabBarIcon: TradeTabIcon,
          headerRight: HeaderRight,
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          title: 'Invest',
          tabBarIcon: InvestTabIcon,
          headerRight: HeaderRight,
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'User',
          tabBarIcon: UserTabIcon,
          headerRight: HeaderRight,
        }}
      />
    </Tabs>
  );
}
