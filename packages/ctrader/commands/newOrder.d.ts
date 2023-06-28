interface NewOrderOptions extends Record<string, any> {
    limitPrice?: number;
    stopPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
    label?: string;
    comment?: string;
}
declare const newOrder: (connection: ConnectionType, symbolId: string, orderType: OrderType, tradeSide: TradeSide, volume: number, options: NewOrderOptions, accountId?: string) => Promise<any>;
export default newOrder;
