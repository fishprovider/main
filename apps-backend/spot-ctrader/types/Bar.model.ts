import type { TrendbarPeriod } from '@fishprovider/ctrader/dist/constants/openApi';

interface BarCTrader {
  period: TrendbarPeriod;
  volume: number;
  low: number | undefined;
  high: number | undefined;
  open: number | undefined;
  close: number | undefined;
  startAt: 0 | Date | undefined;
  timestamp: number | undefined;
}

export type {
  BarCTrader,
};
