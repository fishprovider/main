import storeUser from '@fishbot/cross/stores/user';
import { ErrorType } from '@fishbot/utils/constants/error';
import { StyleSheet } from 'react-native';
import { Button, Label } from 'tamagui';

import EditScreenInfo from '~components/EditScreenInfo';
import { Text, View } from '~components/Themed';
import { login, logout } from '~libs/auth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

export default function Account() {
  const {
    email,
  } = storeUser.useStore((state) => ({
    email: state.info?.email,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/account.tsx" />

      <Label>{email || ErrorType.accountNotFound}</Label>

      <Button themeInverse onPress={login}>Login</Button>
      <Button themeInverse onPress={logout}>Logout</Button>
    </View>
  );
}
