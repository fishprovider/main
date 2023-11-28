import userLogin from '@fishprovider/cross/dist/api/user/login';
import userLogout from '@fishprovider/cross/dist/api/user/logout';
import { initApi } from '@fishprovider/cross/dist/libs/api';
import storeOrders from '@fishprovider/cross/dist/stores/orders';
import { useNavigation } from '@react-navigation/native';

import { updateUserInfoController, watchUserInfoController } from '~controllers/user.controller';
import { getUserToken } from '~libs/auth';
import { cacheWrite } from '~libs/cache';
import { updateSocketUrl } from '~libs/socket';
import Select from '~ui/Select';
import Stack from '~ui/Stack';

const options = [
  { value: 'demo', label: 'Demo' },
  { value: 'live', label: 'Live' },
];

export default function LiveModeSwitch() {
  const navigation = useNavigation<any>();

  const {
    mode = 'live',
  } = watchUserInfoController((state) => ({
    mode: state.mode,
  }));

  const onChangeMode = async (modeNew: string) => {
    await userLogout();

    initApi({
      baseURL: modeNew === 'live'
        ? `${process.env.EXPO_PUBLIC_BACKEND_URL}/api`
        : `${process.env.EXPO_PUBLIC_DEMO_BACKEND_URL}/api`,
    });
    updateSocketUrl(modeNew === 'live'
      ? process.env.EXPO_PUBLIC_SOCKET_URL
      : process.env.EXPO_PUBLIC_DEMO_SOCKET_URL);

    updateUserInfoController({ mode: modeNew });
    // storeAccounts.mergeDocs([], { replaceAll: true });
    storeOrders.mergeDocs([], { replaceAll: true });

    cacheWrite('fp-providerId', '');

    const token = await getUserToken();
    if (token) {
      await userLogin({ token });
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
    navigation.navigate('Strategies');
  };

  return (
    <Stack>
      <Select
        options={options}
        value={mode}
        onChange={onChangeMode}
      />
    </Stack>
  );
}
