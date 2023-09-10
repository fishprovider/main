import walletGetMany from '@fishprovider/cross/dist/api/wallet/getMany';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useMutate, useQuery } from '@fishprovider/cross/dist/libs/query';
import storeWallets from '@fishprovider/cross/dist/stores/wallets';
import { InvestStatus, WalletType } from '@fishprovider/utils/dist/constants/pay';
import type { Wallet as WalletModel } from '@fishprovider/utils/dist/types/Pay.model';
import _ from 'lodash';

import Link from '~components/base/Link';
import Routes from '~libs/routes';
import Card from '~ui/core/Card';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import { toastError, toastSuccess } from '~ui/toast';
import { refreshMS } from '~utils';

const doneStatuses = [
  InvestStatus.active,
  InvestStatus.inactive,
];

function InvestPending() {
  const wallets = storeWallets.useStore((state) => _.filter(
    state,
    (item) => item.type === WalletType.invest
      && !!item.investStatus
      && !doneStatuses.includes(item.investStatus),
  ));

  useQuery({
    queryFn: () => walletGetMany({ type: WalletType.invest }),
    queryKey: queryKeys.wallets(WalletType.invest),
    refetchInterval: refreshMS,
  });

  // TODO: implement
  const investReload = () => walletGetMany({ type: WalletType.invest });

  const { mutate: reload, isLoading: isLoadingReload } = useMutate({
    mutationFn: investReload,
  });

  const onReload = (walletId: string) => {
    reload({ walletId }, {
      onSuccess: () => {
        toastSuccess('Coming soon');
      },
      onError: (err) => toastError(`${err}`),
    });
  };

  const skipClick = (e: React.SyntheticEvent) => e.preventDefault();

  const renderWallet = (wallet: WalletModel) => {
    const {
      _id: walletId, name, investStatus, investData,
    } = wallet;
    const { providerName } = investData || {};

    return (
      <Link key={wallet._id} href={Routes.wallets} variant="clean">
        <Card withBorder>
          <Group position="apart">
            <Text>{providerName || name}</Text>
            <Text>{`${wallet.balance} ${wallet.currency}`}</Text>
            <Group spacing="xs">
              {_.upperFirst(investStatus)}
              <Icon
                name="Sync"
                size="small"
                button
                onClick={(e) => {
                  skipClick(e);
                  onReload(walletId);
                }}
                loading={isLoadingReload}
              />
            </Group>
          </Group>
        </Card>
      </Link>
    );
  };

  return (
    <Stack py="xs">
      {wallets.map(renderWallet)}
    </Stack>
  );
}

export default InvestPending;
