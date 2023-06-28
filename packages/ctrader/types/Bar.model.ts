import type { TrendbarPeriod } from '~constants/openApi';

interface Bar {
  volume: Long;
  period?: TrendbarPeriod;
  low?: Long;
  deltaOpen?: Long;
  deltaClose?: Long;
  deltaHigh?: Long;
  utcTimestampInMinutes?: number;
}

export type {
  Bar,
};
