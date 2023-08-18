import walletGetMany from '@fishprovider/cross/dist/api/wallet/getMany';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeUser from '@fishprovider/cross/dist/stores/user';
import storeWallets from '@fishprovider/cross/dist/stores/wallets';
import { WalletType } from '@fishprovider/utils/dist/constants/pay';
import type { Wallet as WalletModel } from '@fishprovider/utils/dist/types/Pay.model';
import _ from 'lodash';

import Link from '~components/base/Link';
import { toWallet } from '~libs/routes';
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
    <Link key={wallet._id} href={toWallet(wallet._id)} variant="clean">
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
      <Title>My Wallets</Title>
      {wallets.map(renderWallet)}
    </Stack>
  );
}

export default Wallet;
