interface UpdateOrderOptions extends Record<string, any> {
    volume?: number;
    limitPrice?: number;
    stopPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
}
declare const updateOrder: (connection: ConnectionType, orderId: string, options: UpdateOrderOptions, accountId?: string) => Promise<any>;
export default updateOrder;
