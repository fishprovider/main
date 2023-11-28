import { AccountPlan, AccountPlanType, AccountPlatform } from '@fishprovider/core';
import { Direction } from '@fishprovider/utils/dist/constants/order';
import { getPriceFromAmount } from '@fishprovider/utils/dist/helpers/price';
import _ from 'lodash';
import type { Moment } from 'moment';
import moment from 'moment';

const getSLTPAmt = ({
  direction,
  volume,
  entry,
  stopLoss = entry,
  takeProfit = entry,
  asset,
  rate,
}: {
  direction: Direction,
  volume: number,
  entry: number;
  stopLoss?: number;
  takeProfit?: number;
  asset: string;
  rate: number,
}) => {
  const stopLossAmt = _.round(
    (direction === Direction.buy ? stopLoss - entry : entry - stopLoss) * volume,
    2,
  );
  const takeProfitAmt = _.round(
    (direction === Direction.buy ? takeProfit - entry : entry - takeProfit) * volume,
    2,
  );

  const stopLossAmtAsset = `(${_.round((stopLossAmt / rate), 2)} ${asset})`;
  const takeProfitAmtAsset = `(${_.round((takeProfitAmt / rate), 2)} ${asset})`;

  return {
    stopLossAmt,
    takeProfitAmt,
    stopLossAmtAsset,
    takeProfitAmtAsset,
  };
};

const getDefaultSLTP = (
  balance: number,
  plan: AccountPlan[],
  direction: Direction,
  volume: number,
  entry: number,
  rate: number,
) => {
  const scale = 0.99;
  const defaultAmt = Math.max(balance / 100, 10); // 1% of balance or $10

  const planSLAmt = (plan.find((item) => item.type === AccountPlanType.stopLoss)
    ?.value) as number | undefined;
  const planTPAmt = (plan.find((item) => item.type === AccountPlanType.takeProfit)
    ?.value) as number | undefined;

  const defaultSL = Math.max(0, getPriceFromAmount({
    direction,
    volume,
    entry,
    assetAmt: (planSLAmt || -defaultAmt) * scale,
    rate,
  }));
  const defaultTP = Math.max(0, getPriceFromAmount({
    direction,
    volume,
    entry,
    assetAmt: (planTPAmt || defaultAmt) * scale,
    rate,
  }));

  return {
    defaultSL,
    defaultTP,
    planSLAmt,
    planTPAmt,
  };
};

const getMarketStateCTrader = (providerData?: any) => {
  const getRemainingTime = (nextTime: Moment) => {
    const hours = nextTime.diff(moment(), 'hours');
    const minutes = nextTime.diff(moment().add(hours, 'hours'), 'minutes');
    const seconds = nextTime.diff(
      moment().add(hours, 'hours').add(minutes, 'minutes'),
      'seconds',
    );
    return { hours, minutes, seconds };
  };

  const getSessionTime = (session: any) => ({
    start: moment.utc().day(0).hour(0).second(0)
      .second(session.startSecond),
    end: moment.utc().day(0).hour(0).second(0)
      .second(session.endSecond),
  });

  const getMarketState = (schedule: any) => {
    if (!schedule) return null;

    let sessionId = moment.utc().day();
    let session = schedule[sessionId];

    if (!session) {
      sessionId -= 1;
      session = schedule[sessionId];
      if (!session) return { status: 'Closed' };
    }

    let sessionTime = getSessionTime(session);
    const now = moment();
    if (now < sessionTime.start) {
      sessionId -= 1;
      session = schedule[sessionId];
      if (!session) return { status: 'Closed' };
      sessionTime = getSessionTime(session);
    }

    if (now < sessionTime.end) {
      const { hours, minutes, seconds } = getRemainingTime(sessionTime.end);
      return {
        status: 'Opening',
        text: `Ends in ${hours}:${minutes}:${seconds}`,
      };
    }

    const sessionNext = schedule[sessionId + 1];
    if (!sessionNext) return { status: 'Closed' };

    const sessionTimeNext = getSessionTime(sessionNext);
    const { hours, minutes, seconds } = getRemainingTime(sessionTimeNext.start);
    return { status: 'Closed', text: `Starts in ${hours}:${minutes}:${seconds}` };
  };

  return getMarketState(providerData?.schedule);
};

const getMarketStateMetaTrader = (providerData?: any) => {
  // TODO: implement
  console.log(providerData);
  return null;
};

interface MarketState {
  status?: string;
  text?: string;
}

const getMarketState = (
  platform?: AccountPlatform,
  providerData?: any,
): MarketState | null => {
  switch (platform) {
    case AccountPlatform.ctrader:
      return getMarketStateCTrader(providerData);
    case AccountPlatform.metatrader:
      return getMarketStateMetaTrader(providerData);
    default:
      return null;
  }
};

export {
  getDefaultSLTP,
  getMarketState,
  getSLTPAmt,
};
