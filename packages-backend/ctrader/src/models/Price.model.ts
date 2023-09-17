import { CTraderTrendbarPeriod } from '.';

export interface CTraderAsset {
  assetId: Long;
  name: string;
  displayName?: string;
  digits?: number;
}

export interface CTraderInterval {
  startSecond: number;
  endSecond: number;
}

export interface CTraderHoliday {
  holidayId: Long;
  name: string;
  description?: string;
  scheduleTimeZone: string;
  holidayDate: Long;
  isRecurring: boolean;
  startSecond: number;
  endSecond: number;
}

export interface CTraderLightSymbol {
  symbolId: Long;
  symbolName?: string;
  enabled?: boolean;
  baseAssetId?: Long;
  quoteAssetId?: Long;
  symbolCategoryId?: Long;
  description?: string;
}

export interface CTraderSymbolDetail {
  symbolId: Long;
  digits: number;
  pipPosition: number;
  lotSize?: Long;
  minVolume?: Long;
  maxVolume?: Long;
  //
  schedule: CTraderInterval[];
  //
  scheduleTimeZone?: string;
  //
  holiday: CTraderHoliday[];
  //
}

export interface CTraderBar {
  volume: Long;
  period?: CTraderTrendbarPeriod;
  low?: Long;
  deltaOpen?: Long;
  deltaClose?: Long;
  deltaHigh?: Long;
  utcTimestampInMinutes?: number;
}

export interface CTraderDepth {
  id: Long;
  size: Long;
  bid?: Long;
  ask?: Long;
}

export interface CTraderTick {
  timestamp: Long;
  tick?: Long;
}
