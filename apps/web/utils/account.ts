import { PlanType } from '@fishbot/utils/constants/account';
import type { Account, Plan } from '@fishbot/utils/types/Account.model';
import type { Order } from '@fishbot/utils/types/Order.model';
import _ from 'lodash';

const getAccountStats = (
  balance: number,
  profit: number,
  liveOrders: Order[],
  marginRaw?: number,
) => {
  const equity = balance + profit;
  const profitRatio = (100 * profit) / balance;

  let margin = marginRaw || 0;
  if (!marginRaw) {
    liveOrders.forEach((order) => {
      margin += order.margin || 0;
    });
  }
  const marginFree = equity - margin;
  const marginLevel = (100 * equity) / margin;

  return {
    equity,
    profit,
    profitRatio,
    margin,
    marginFree,
    marginLevel,
  };
};

const scaleMaxLotPairs = (account: Account, scale: number) => {
  const { plan } = account;
  if (!plan) return account;

  const planIndex = plan.findIndex((item) => item.type === PlanType.maxLotPairs);
  if (planIndex === -1) return account;

  const maxLotPairs = plan[planIndex]?.value as Record<string, number>;

  const maxLotPairsNew = { ...maxLotPairs };
  _.forEach(maxLotPairs, (lot, pair) => {
    maxLotPairsNew[pair] = _.round(lot * scale, 2);
  });

  const planNew = [...plan];
  (planNew[planIndex] as Plan).value = maxLotPairsNew;

  const accountNew = { ...account, plan: planNew };
  return accountNew;
};

const getActivityColor = (lastSeenMinutes = 10000) => {
  if (lastSeenMinutes < 15) return 'green';
  if (lastSeenMinutes < 60) return 'lime';
  if (lastSeenMinutes < 60 * 4) return 'violet';
  if (lastSeenMinutes < 60 * 12) return 'grape';
  if (lastSeenMinutes < 60 * 24) return 'black';
  if (lastSeenMinutes < 60 * 24 * 7) return 'gray';
  return '';
};

const getRiskScoreText = (riskScore = 10) => {
  if (riskScore <= 2) return 'Low Risk';
  if (riskScore <= 3) return 'Medium Risk';
  return 'High Risk';
};

const getRiskScoreColor = (riskScore = 10) => {
  if (riskScore <= 2) return 'green';
  if (riskScore <= 3) return 'yellow';
  return 'red';
};

export {
  getAccountStats, getActivityColor, getRiskScoreColor,
  getRiskScoreText, scaleMaxLotPairs,
};
