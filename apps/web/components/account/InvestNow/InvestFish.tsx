import investAdd from '@fishprovider/cross/dist/api/invest/add';
import walletGetMany from '@fishprovider/cross/dist/api/wallet/getMany';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useMutate, useQuery } from '@fishprovider/cross/dist/libs/query';
import storeUser from '@fishprovider/cross/dist/stores/user';
import storeWallets from '@fishprovider/cross/dist/stores/wallets';
import { WalletType } from '@fishprovider/utils/dist/constants/pay';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Link from '~components/base/Link/Link';
import RequiredLoginView from '~components/user/RequiredLoginView';
import Routes from '~libs/routes';
import Box from '~ui/core/Box';
import Button from '~ui/core/Button';
import NumberInput from '~ui/core/NumberInput';
import Stack from '~ui/core/Stack';
import Stepper from '~ui/core/Stepper';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title/Title';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError, toastSuccess } from '~ui/toast';
import { refreshMS } from '~utils';

const MIN_INVEST = 10000;

interface Props {
  providerId: string;
  onClose?: () => void;
}

function InvestFish({
  providerId,
  onClose = () => undefined,
}: Props) {
  const router = useRouter();

  const {
    isServerLoggedIn,
    userId,
    userEmail,
  } = storeUser.useStore((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
    userId: state.info?._id,
    userEmail: state.info?.email,
  }));

  const currency = 'USD';
  const walletId = `${userId}-${currency}`;

  const wallet = storeWallets.useStore((state) => state[walletId]);
  const [amount, setAmount] = useState<number | string>(MIN_INVEST);

  const { balance = 0 } = wallet || {};

  useQuery({
    queryFn: () => walletGetMany({ type: WalletType.spot }),
    queryKey: queryKeys.wallets(WalletType.spot),
    refetchInterval: refreshMS,
  });

  const { mutate: invest, isLoading } = useMutate({
    mutationFn: investAdd,
  });

  const onInvest = async () => {
    if (!amount || +amount < MIN_INVEST) {
      toastError(`Minimum investment amount is ${MIN_INVEST} USD`);
      return;
    }
    if (balance < +amount) {
      toastError('Insufficient balance');
      return;
    }

    if (!(await openConfirmModal())) return;

    invest({ amount: +amount, providerId }, {
      onSuccess: () => {
        toastSuccess('Done');
        if (onClose) onClose();
        router.push(Routes.invest);
      },
      onError: (err) => toastError(`${err}`),
    });
  };

  const getActive = () => {
    if (!isServerLoggedIn) return 0;
    if (balance < MIN_INVEST) return 1;
    return 2;
  };

  const checkAmount = () => {
    if (!amount || +amount < MIN_INVEST) return `Minimum investment amount is ${MIN_INVEST} USD`;
    if (balance < +amount) {
      return (
        <Text>
          {'Insufficient balance. Please '}
          <Link href={Routes.deposit} onClick={onClose}>deposit</Link>
          {' more'}
        </Text>
      );
    }
    return undefined;
  };

  return (
    <Stack>
      <Title size="h4">
        Minimum Investment:
        {' '}
        {MIN_INVEST}
        {' '}
        USD
      </Title>
      <Stepper active={getActive()} orientation="vertical">
        <Stepper.Step
          label={(
            <Stack spacing="xs" pb="md">
              <Text>Login to FishProvider</Text>
              {!isServerLoggedIn
                ? <RequiredLoginView />
                : <Text>{`Done. Logged in as ${userEmail}`}</Text>}
            </Stack>
          )}
        />
        <Stepper.Step
          label={(
            <Stack spacing="xs" pb="md">
              <Text>Deposit funds</Text>
              {balance < MIN_INVEST
                ? (
                  <Stack spacing="xs">
                    <Text>{`Your balance is ${balance} USD`}</Text>
                    <Link href={Routes.deposit} onClick={onClose}>
                      <Button>Deposit now ➜ 💰</Button>
                    </Link>
                  </Stack>
                )
                : (
                  <Stack spacing="xs">
                    <Text>{`Done. Your balance is ${balance} USD`}</Text>
                    <Text>
                      {'(Optional) '}
                      <Link href={Routes.deposit} variant="noColor" onClick={onClose}>Deposit</Link>
                      {' more'}
                    </Text>
                  </Stack>
                )}
            </Stack>
          )}
        />
        <Stepper.Step
          label={(
            <Stack spacing="xs">
              <Text>Set invest amount (USD)</Text>
              <NumberInput
                value={amount ?? balance}
                onChange={(value) => setAmount(value)}
                error={checkAmount()}
              />
              <Box>
                <Button color="green" onClick={onInvest} loading={isLoading}>Invest now ➜ 🏦</Button>
              </Box>
            </Stack>
          )}
        />
      </Stepper>
    </Stack>
  );
}

export default InvestFish;
