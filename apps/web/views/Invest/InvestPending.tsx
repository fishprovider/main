import walletGetMany from '@fishbot/cross/api/wallet/getMany';
import { useMutate, useQuery } from '@fishbot/cross/libs/query';
import storeWallets from '@fishbot/cross/stores/wallets';
import { InvestStatus, WalletType } from '@fishbot/utils/constants/pay';
import type { Wallet as WalletModel } from '@fishbot/utils/types/Pay.model';
import _ from 'lodash';

import Link from '~components/base/Link';
import { queryKeys } from '~constants/query';
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
      <Link key={wallet._id} href={Routes.invest} variant="clean">
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
