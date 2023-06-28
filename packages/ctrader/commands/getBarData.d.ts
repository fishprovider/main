declare const getBarData: (connection: ConnectionType, symbolId: string, period: TrendbarPeriod, fromTimestamp: number, toTimestamp: number) => Promise<any>;
export default getBarData;
