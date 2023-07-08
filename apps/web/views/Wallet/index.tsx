import walletGetMany from '@fishprovider/cross/api/wallet/getMany';
import { useQuery } from '@fishprovider/cross/libs/query';
import storeUser from '@fishprovider/cross/stores/user';
import storeWallets from '@fishprovider/cross/stores/wallets';
import { WalletType } from '@fishprovider/utils/constants/pay';
import type { Wallet as WalletModel } from '@fishprovider/utils/types/Pay.model';
import _ from 'lodash';

import Link from '~components/base/Link';
import { queryKeys } from '~constants/query';
import Routes from '~libs/routes';
import Card from '~ui/core/Card';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';
import { refreshMS } from '~utils';

function Wallet() {
  const {
    userId = '',
    userEmail = '',
    userName = '',
  } = storeUser.useStore((state) => ({
    userId: state.info?._id,
    userEmail: state.info?.email,
    userName: state.info?.name,
  }));

  const wallets = storeWallets.useStore((state) => _.filter(
    state,
    (item) => item.type === WalletType.spot,
  ));

  useQuery({
    queryFn: () => walletGetMany({ type: WalletType.spot }),
    queryKey: queryKeys.wallets(WalletType.spot),
    refetchInterval: refreshMS,
  });

  if (!wallets.length) {
    wallets.push({
      _id: `${userId}-USD`,
      type: WalletType.spot,

      userId,
      userEmail,
      userName,
      name: 'USD Wallet',

      currency: 'USD',
      balance: 0,

      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  const renderWallet = (wallet: WalletModel) => (
    <Link key={wallet._id} href={Routes.wallet} variant="clean">
      <Card withBorder>
        <Group position="apart">
          <Text>{wallet.name || wallet.currency}</Text>
          <Text>{`${wallet.balance} ${wallet.currency}`}</Text>
        </Group>
      </Card>
    </Link>
  );

  return (
    <Stack py="xs">
      <Title>Wallet</Title>
      {wallets.map(renderWallet)}
    </Stack>
  );
}

export default Wallet;
