interface UpdatePositionOptions extends Record<string, any> {
    stopLoss?: number;
    takeProfit?: number;
}
declare const updatePosition: (connection: ConnectionType, positionId: string, options: UpdatePositionOptions, accountId?: string) => Promise<any>;
export default updatePosition;
