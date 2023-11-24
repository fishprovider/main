import { AccountPlan, AccountPlanType, ProviderType } from '@fishprovider/core';
import priceGetMany from '@fishprovider/cross/dist/api/prices/getMany';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import _ from 'lodash';

import { watchUserInfoController } from '~controllers/user.controller';
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
  } = watchUserInfoController((state) => ({
    plans: state.activeAccount?.plan,
    asset: state.activeAccount?.asset,
    providerType: state.activeAccount?.providerType,
  }));

  const symbols = _.sortBy(
    (plans.find((plan) => (plan.type === AccountPlanType.pairs))?.value || []) as string[],
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

  const getInfo = (plan: AccountPlan) => {
    const { type, value } = plan;
    switch (type) {
      case AccountPlanType.pairs:
        return {
          header: 'Pairs',
          description: 'Pairs are allowed to trade',
          content: Pairs(prices, value as string[]),
        };

      case AccountPlanType.maxLotTotal:
        return {
          header: 'Max Lot in Total',
          description: 'Max lot in total for all orders',
          content: value as number,
        };
      case AccountPlanType.maxLotOrder:
        return {
          header: 'Max Lot per Order',
          description: 'Max lot for each order to open',
          content: value as number,
        };
      case AccountPlanType.maxLotPair:
        return {
          header: 'Max Lot on Pair',
          description: 'Max lot for all orders of a pair',
          content: value as number,
        };
      case AccountPlanType.maxLotPairs:
        return {
          header: 'Max Lot on Pairs',
          description: 'Max lot for all orders of a pair',
          content: PairsWithLot(prices, value as Record<string, number>),
        };

      case AccountPlanType.stopLoss:
        return {
          header: 'Max SL',
          description: 'Max StopLoss',
          content: `${value} ${asset}`,
        };
      case AccountPlanType.takeProfit:
        return {
          header: 'Max TP',
          description: 'Max TakeProfit',
          content: `${value} ${asset}`,
        };
      case AccountPlanType.minTakeProfit:
        return {
          header: 'Min TP',
          description: 'Min TakeProfit, a ratio of Risk_TP over Risk_SL',
          content: `${value} x Risk_SL`,
        };
      case AccountPlanType.stepTakeProfit:
        return {
          header: 'Step TP',
          description: 'TP amount for checkpoints',
          content: `${value} ${asset}`,
        };
      case AccountPlanType.limitOnly:
        return {
          header: 'Limit Order Only',
          description: 'Only allow to open limit order with this amount',
          content: `${value} ${asset}`,
        };

      case AccountPlanType.dayMaxBddLock:
        return {
          header: 'Daily Max Balance Drawdown',
          description: `Auto lock account when balance drawdown reaches ${value}`,
          content: `${value} ${asset}`,
        };
      case AccountPlanType.dayMaxEddLock:
        return {
          header: 'Daily Max Equity Drawdown',
          description: `Auto lock account when equity drawdown reaches ${value}`,
          content: `${value} ${asset}`,
        };
      case AccountPlanType.lostSeriesPairLock:
        return {
          header: 'Lost Series Pair Lock',
          description: `Auto lock pair when lost of a pair reaches ${value}`,
          content: `${value} ${asset}`,
        };

      case AccountPlanType.monthTargetLock:
        return {
          header: 'Monthly Target Lock',
          description: 'Auto lock account when equity reaches monthly target',
          content: `${value} ${asset}`,
        };
      case AccountPlanType.profitOffset:
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

  const renderRow = (plan: AccountPlan) => {
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
