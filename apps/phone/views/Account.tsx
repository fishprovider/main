import accountGetManySlim from '@fishbot/cross/api/accounts/getManySlim';
import { queryKeys } from '@fishbot/cross/constants/query';
import { useQuery } from '@fishbot/cross/libs/query';
import storeAccounts from '@fishbot/cross/stores/accounts';
import { ErrorType } from '@fishbot/utils/constants/error';
import _ from 'lodash';
import { StyleSheet } from 'react-native';
import { Button, Label } from 'tamagui';

import EditScreenInfo from '~components/EditScreenInfo';
import { Text, View } from '~components/Themed';

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
  const accounts = storeAccounts.useStore((state) => _.orderBy(
    state,
    [
      (account) => account.order || 0,
      (account) => account.name,
    ],
    ['desc', 'asc'],
  ));

  useQuery({
    queryFn: accountGetManySlim,
    queryKey: queryKeys.slimAccounts(),
  });

  console.log(accounts);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/account.tsx" />
      <Button themeInverse>Hello</Button>
      <Label>{ErrorType.accountNotFound}</Label>
    </View>
  );
}
