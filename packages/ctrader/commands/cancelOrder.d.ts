declare const cancelOrder: (connection: ConnectionType, orderId: string, accountId?: string) => Promise<any>;
export default cancelOrder;
