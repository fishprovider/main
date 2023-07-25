import priceGetMany from '@fishprovider/cross/dist/api/prices/getMany';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { PlanType, ProviderType } from '@fishprovider/utils/dist/constants/account';
import type { Plan } from '@fishprovider/utils/dist/types/Account.model';
import _ from 'lodash';

import Stack from '~ui/core/Stack';
import Table from '~ui/core/Table';
import Title from '~ui/core/Title';
import Tooltip from '~ui/core/Tooltip';

import { Pairs, PairsWithLot } from './pair';

function TradingPlan() {
  const {
    plans = [],
    asset = 'USD',
    providerType = ProviderType.icmarkets,
  } = storeUser.useStore((state) => ({
    plans: state.activeProvider?.plan,
    asset: state.activeProvider?.asset,
    providerType: state.activeProvider?.providerType,
  }));

  const symbols = _.sortBy(
    (plans.find((plan) => (plan.type === PlanType.pairs))?.value || []) as string[],
  );

  const prices = storePrices.useStore((state) => _.filter(
    state,
    (item) => item.providerType === providerType && symbols.includes(item.symbol),
  ));

  useQuery({
    queryFn: () => priceGetMany({ providerType, symbols, reload: true }),
    queryKey: queryKeys.prices(providerType, ...symbols),
    enabled: !!symbols.length,
  });

  const getInfo = (plan: Plan) => {
    const { type, value } = plan;
    switch (type) {
      case PlanType.pairs:
        return {
          header: 'Pairs',
          description: 'Pairs are allowed to trade',
          content: Pairs(prices, value as string[]),
        };

      case PlanType.maxLotTotal:
        return {
          header: 'Max Lot in Total',
          description: 'Max lot in total for all orders',
          content: value as number,
        };
      case PlanType.maxLotOrder:
        return {
          header: 'Max Lot per Order',
          description: 'Max lot for each order to open',
          content: value as number,
        };
      case PlanType.maxLotPair:
        return {
          header: 'Max Lot on Pair',
          description: 'Max lot for all orders of a pair',
          content: value as number,
        };
      case PlanType.maxLotPairs:
        return {
          header: 'Max Lot on Pairs',
          description: 'Max lot for all orders of a pair',
          content: PairsWithLot(prices, value as Record<string, number>),
        };

      case PlanType.stopLoss:
        return {
          header: 'Max SL',
          description: 'Max StopLoss',
          content: `${value} ${asset}`,
        };
      case PlanType.takeProfit:
        return {
          header: 'Max TP',
          description: 'Max TakeProfit',
          content: `${value} ${asset}`,
        };
      case PlanType.minTakeProfit:
        return {
          header: 'Min TP',
          description: 'Min TakeProfit, a ratio of Risk_TP over Risk_SL',
          content: `${value} x Risk_SL`,
        };
      case PlanType.stepTakeProfit:
        return {
          header: 'Step TP',
          description: 'TP amount for checkpoints',
          content: `${value} ${asset}`,
        };
      case PlanType.limitOnly:
        return {
          header: 'Limit Order Only',
          description: 'Only allow to open limit order with this amount',
          content: `${value} ${asset}`,
        };

      case PlanType.dayMaxBddLock:
        return {
          header: 'Daily Max Balance Drawdown',
          description: `Auto lock account when balance drawdown reaches ${value}`,
          content: `${value} ${asset}`,
        };
      case PlanType.dayMaxEddLock:
        return {
          header: 'Daily Max Equity Drawdown',
          description: `Auto lock account when equity drawdown reaches ${value}`,
          content: `${value} ${asset}`,
        };
      case PlanType.lostSeriesPairLock:
        return {
          header: 'Lost Series Pair Lock',
          description: `Auto lock pair when lost of a pair reaches ${value}`,
          content: `${value} ${asset}`,
        };

      case PlanType.monthTargetLock:
        return {
          header: 'Monthly Target Lock',
          description: 'Auto lock account when equity reaches monthly target',
          content: `${value} ${asset}`,
        };
      case PlanType.profitOffset:
        return {
          header: 'Profit Offset',
          description: 'Profit offset to add to avoid unattended market loss',
          content: `${value} ${asset}`,
        };

      default:
        return {
          header: '',
          description: '',
          content: '',
        };
    }
  };

  const renderRow = (plan: Plan) => {
    const { header, description, content } = getInfo(plan);
    if (!header) return null;
    return (
      <Table.Row key={plan.type}>
        <Table.Cell>
          <Tooltip label={description}>{header}</Tooltip>
        </Table.Cell>
        <Table.Cell>{content}</Table.Cell>
      </Table.Row>
    );
  };

  return (
    <Stack>
      <Title size="h3">📝 Trading Plan</Title>
      {plans.length ? (
        <Table>
          <Table.TBody>
            {plans.map(renderRow)}
          </Table.TBody>
        </Table>
      ) : <Title size="h4">🔥🔥🔥 N.A.</Title>}
    </Stack>
  );
}

export default TradingPlan;
