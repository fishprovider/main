import investRemove from '@fishprovider/cross/dist/api/invest/remove';
import walletGetMany from '@fishprovider/cross/dist/api/wallet/getMany';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useMutate, useQuery } from '@fishprovider/cross/dist/libs/query';
import storeWallets from '@fishprovider/cross/dist/stores/wallets';
import { InvestStatus, WalletType } from '@fishprovider/utils/dist/constants/pay';
import type { Wallet as WalletModel } from '@fishprovider/utils/dist/types/Pay.model';
import _ from 'lodash';
import moment from 'moment';

import Link from '~components/base/Link';
import Routes from '~libs/routes';
import Card from '~ui/core/Card';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Popover from '~ui/core/Popover';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError, toastSuccess } from '~ui/toast';
import { refreshMS } from '~utils';

function InvestActive() {
  const wallets = storeWallets.useStore((state) => _.filter(
    state,
    (item) => item.type === WalletType.invest
      && item.investStatus === InvestStatus.active,
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

  const { mutate: remove, isLoading: isLoadingRemove } = useMutate({
    mutationFn: investRemove,
  });

  const onReload = (walletId: string) => {
    reload({ walletId }, {
      onSuccess: () => {
        toastSuccess('Coming soon');
      },
      onError: (err) => toastError(`${err}`),
    });
  };

  const onRemove = async (walletId: string) => {
    if (!(await openConfirmModal())) return;

    remove({ walletId }, {
      onSuccess: () => {
        toastSuccess('Done');
      },
      onError: (err) => toastError(`${err}`),
    });
  };

  const skipClick = (e: React.SyntheticEvent) => e.preventDefault();

  const renderWallet = (wallet: WalletModel) => {
    const {
      _id: walletId, name, balance, investStatus, investData,
    } = wallet;

    const {
      providerName,
      startedAt = '',
      balanceStart = 0,
    } = investData || {};
    const profit = balanceStart ? balance - balanceStart : 0;
    const roi = balanceStart ? profit / balanceStart : 0;
    const duration = startedAt && moment(startedAt).fromNow();

    return (
      <Link key={wallet._id} href={Routes.invest} variant="clean">
        <Card withBorder>
          <Group position="apart">
            <Text>{providerName || name}</Text>
            <Popover content={(
              <>
                <Text>{`Start: ${balanceStart} ${wallet.currency}`}</Text>
                <Text>{`Profit: ${profit} ${wallet.currency} (${roi}%)`}</Text>
                <Text>{`Duration: ${duration}`}</Text>
              </>
            )}
            >
              <Group spacing="xs" onClick={skipClick}>
                <Text>{`${wallet.balance} ${wallet.currency}`}</Text>
                <Text>{`(${roi}%)`}</Text>
                <Icon name="Info" button />
              </Group>
            </Popover>
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
              <Icon
                name="Delete"
                size="small"
                button
                onClick={(e) => {
                  skipClick(e);
                  onRemove(walletId);
                }}
                loading={isLoadingRemove}
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

export default InvestActive;
