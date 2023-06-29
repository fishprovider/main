import getBarData from '@fishbot/ctrader/commands/getBarData';
import { TrendbarPeriod } from '@fishbot/ctrader/constants/openApi';
import type { ConnectionType } from '@fishbot/ctrader/types/Connection.model';
import type { SymbolCTrader } from '@fishbot/swap/types/Symbol.model';
import type { ProviderType } from '@fishbot/utils/constants/account';
import delay from '@fishbot/utils/helpers/delay';
import _ from 'lodash';
import type { Moment } from 'moment';
import moment from 'moment';

import { updateBar } from '~utils/bar';
import { periods } from '~utils/tasks';

const env = {
  typeId: process.env.TYPE_ID || '',
  scaleLastBars: process.env.SCALE_LAST_BARS || 1,
};

const periodTexts = _.invert(TrendbarPeriod);

const getFrom = (now: Moment, period: TrendbarPeriod) => {
  const scale = +env.scaleLastBars;
  switch (period) {
    case TrendbarPeriod.MN1:
      return now.subtract(1 * (12 * 2) * scale, 'months').unix() * 1000; // 2 years
    case TrendbarPeriod.W1:
      return now.subtract(1 * (4 * 12) * scale, 'weeks').unix() * 1000; // 1 year
    case TrendbarPeriod.D1:
      return now.subtract(1 * (30 * 3) * scale, 'days').unix() * 1000; // 3 months
    case TrendbarPeriod.H4:
      return now.subtract(4 * (6 * 14) * scale, 'hours').unix() * 1000; // 2 weeks
    case TrendbarPeriod.H1:
      return now.subtract(1 * (24 * 3) * scale, 'hours').unix() * 1000; // 3 days
    case TrendbarPeriod.M15:
      return now.subtract(15 * (4 * 24) * scale, 'minutes').unix() * 1000; // 1 day
    case TrendbarPeriod.M5:
      return now.subtract(5 * (12 * 8) * scale, 'minutes').unix() * 1000; // 8 hours
    case TrendbarPeriod.M3:
      return now.subtract(3 * (20 * 4) * scale, 'minutes').unix() * 1000; // 4 hours
    case TrendbarPeriod.M1:
      return now.subtract(1 * (60 * 2) * scale, 'minutes').unix() * 1000; // 2 hours
    default: {
      const msg = `Unhandled period ${period}`;
      Logger.error(msg);
      throw new Error(msg);
    }
  }
};

const updateSymbolPeriodLastBars = async (
  connection: ConnectionType,
  providerType: ProviderType,
  symbol: string,
  symbolId: string,
  period: TrendbarPeriod,
) => {
  const now = moment();
  const to = now.unix() * 1000;
  const from = getFrom(now, period);

  Logger.debug(`Getting... ${symbol} ${periodTexts[period]}`);
  const { bar: lastBars } = await getBarData(
    connection,
    symbolId,
    period,
    from,
    to,
  );

  Logger.debug(`Saving... ${symbol} ${periodTexts[period]} ${lastBars.length} bars`);
  for (const lastBar of lastBars) {
    await updateBar(providerType, symbol, { ...lastBar, period });
  }

  await delay(500);
};

const updateSymbolLastBars = async (
  connection: ConnectionType,
  providerType: ProviderType,
  symbol: string,
  symbolId: string,
) => {
  for (const period of periods) {
    await updateSymbolPeriodLastBars(
      connection,
      providerType,
      symbol,
      symbolId,
      TrendbarPeriod[period as keyof typeof TrendbarPeriod],
    );
  }
};

const updateLastBars = async (
  connection: ConnectionType,
  allSymbols: SymbolCTrader[],
  providerType: ProviderType,
) => {
  for (const { symbol, symbolId } of allSymbols) {
    await updateSymbolLastBars(connection, providerType, symbol, symbolId);
  }
};

export default updateLastBars;
