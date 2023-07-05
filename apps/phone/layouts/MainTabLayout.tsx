import { FontAwesome } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';

import Colors from '~constants/Colors';

interface IconProps {
  color: string;
}

function InvestTabIcon({ color }: IconProps) {
  return (
    <FontAwesome
      name="rocket"
      size={20}
      color={color}
    />
  );
}

function WalletTabIcon({ color }: IconProps) {
  return (
    <FontAwesome
      name="bank"
      size={20}
      color={color}
    />
  );
}

function AccountTabIcon({ color }: IconProps) {
  return (
    <FontAwesome
      name="bar-chart"
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

export default function BaseLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Invest',
          tabBarIcon: InvestTabIcon,
          headerRight: HeaderRight,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: WalletTabIcon,
          headerRight: HeaderRight,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: AccountTabIcon,
          headerRight: HeaderRight,
        }}
      />
    </Tabs>
  );
}
