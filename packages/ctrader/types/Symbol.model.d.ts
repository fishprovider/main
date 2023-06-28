/// <reference types="long" />
interface Asset {
    assetId: Long;
    name: string;
    displayName?: string;
    digits?: number;
}
interface Interval {
    startSecond: number;
    endSecond: number;
}
interface Holiday {
    holidayId: Long;
    name: string;
    description?: string;
    scheduleTimeZone: string;
    holidayDate: Long;
    isRecurring: boolean;
    startSecond: number;
    endSecond: number;
}
interface LightSymbol {
    symbolId: Long;
    symbolName?: string;
    enabled?: boolean;
    baseAssetId?: Long;
    quoteAssetId?: Long;
    symbolCategoryId?: Long;
    description?: string;
}
interface SymbolDetail {
    symbolId: Long;
    digits: number;
    pipPosition: number;
    lotSize?: Long;
    minVolume?: Long;
    maxVolume?: Long;
    schedule: Interval[];
    scheduleTimeZone?: string;
    holiday: Holiday[];
}
export type { Asset, LightSymbol, SymbolDetail, };
