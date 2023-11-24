import { AccountPlanType } from '@fishprovider/core';
import orderUpdate from '@fishprovider/cross/dist/api/orders/update';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import { Direction } from '@fishprovider/utils/dist/constants/order';
import { getProfit } from '@fishprovider/utils/dist/helpers/order';
import { getPriceFromAmount } from '@fishprovider/utils/dist/helpers/price';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import _ from 'lodash';

import { watchUserInfoController } from '~controllers/user.controller';
import useConversionRate from '~hooks/useConversionRate';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError, toastSuccess } from '~ui/toast';

interface Props {
  order: Order;
  prices: Record<string, Price>;
}

function LockSL({ order, prices }: Props) {
  const {
    providerType, direction, volume, symbol, price: entry, takeProfit, lockSLAmt,
  } = order;

  const {
    stepTakeProfit = 0,
    profitOffset = 0,
    asset = 'USD',
  } = watchUserInfoController((state) => ({
    stepTakeProfit: state.activeAccount?.plan
      ?.find((item) => item.type === AccountPlanType.stepTakeProfit)?.value as number,
    profitOffset: state.activeAccount?.plan
      ?.find((item) => item.type === AccountPlanType.profitOffset)?.value as number,
    asset: state.activeAccount?.asset,
  }));

  const priceDoc = prices[`${providerType}-${symbol}`];

  const rate = useConversionRate(symbol);

  const { mutate: updateSL, isLoading } = useMutate({
    mutationFn: orderUpdate,
  });

  if (!priceDoc || !entry) return null;

  const profit = getProfit([order], prices, asset);

  const getNewTP = (steps: number) => {
    if (takeProfit) {
      const newTP = _.round(getPriceFromAmount({
        direction,
        volume,
        entry: takeProfit,
        assetAmt: stepTakeProfit * steps,
        rate,
      }), priceDoc.digits);
      if (direction === Direction.buy) {
        if (newTP > takeProfit) {
          return newTP;
        }
      } else if (newTP < takeProfit) {
        return newTP;
      }
    }
    return 0;
  };

  const getNewSL = (stepLockSLAmt: number) => _.round(getPriceFromAmount({
    direction,
    volume,
    entry,
    assetAmt: stepLockSLAmt,
    rate,
  }), priceDoc.digits);

  const lockSL = async (stepLockSLAmt: number, steps: number) => {
    if (!(await openConfirmModal({
      title: `Lock SL ${_.upperFirst(direction)} ${volume} ${symbol}?`,
    }))) return;

    const newSL = getNewSL(stepLockSLAmt);
    const newTP = getNewTP(steps);
    updateSL({
      order,
      options: {
        stopLoss: newSL,
        lockSL: newSL,
        lockSLAmt: stepLockSLAmt,
        ...(newTP && { takeProfit: newTP }),
      },
    }, {
      onSuccess: () => toastSuccess('Done'),
      onError: (err) => toastError(`${err}`),
    });
  };

  const renderLockSL = (step: number) => {
    if (step && !stepTakeProfit) return null;

    const minProfit = stepTakeProfit * step + profitOffset;
    const hasLock = lockSLAmt !== undefined && lockSLAmt >= minProfit;

    return (
      <span
        style={{
          ...(hasLock && { pointerEvents: 'none' }),
        }}
      >
        <Icon
          name={step === 0 ? 'SecurityOutlined' : 'VerifiedUserOutlined'}
          size="small"
          tooltip={`Lock SL to ${minProfit} USD`}
          button
          disabled={profit < minProfit}
          color={hasLock ? 'green' : undefined}
          loading={isLoading}
          onClick={() => {
            const stepCur = lockSLAmt ? Math.round(lockSLAmt / stepTakeProfit) : 0;
            lockSL(minProfit, step - stepCur);
          }}
        />
      </span>
    );
  };

  const renderLockSLMore = () => {
    if (!lockSLAmt) return null;

    const step = Math.round(lockSLAmt / stepTakeProfit);
    return _.range(3, step + 4).map(renderLockSL);
  };

  return (
    <Group spacing={0}>
      {renderLockSL(0)}
      {renderLockSL(1)}
      {renderLockSL(2)}
      {renderLockSLMore()}
    </Group>
  );
}

export default LockSL;
