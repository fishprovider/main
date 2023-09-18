import {
  CTraderDeal, CTraderExecutionEvent, CTraderOrder, CTraderOrderType,
  CTraderPayloadType, CTraderPosition, CTraderTradeSide, TCTraderConnection,
  transformDeal,
  transformOrder, transformPosition, validate,
} from '..';

export const getAllPositionsAndOrders = async (
  connection: TCTraderConnection,
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    ctidTraderAccountId: Long;
    position: CTraderPosition[]
    order: CTraderOrder[]
  }>({
    name: 'ProtoOAReconcileReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_RECONCILE_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );

  const { position, order } = res;
  return {
    ...res,
    positions: position.map(transformPosition),
    orders: order.map(transformOrder),
  };
};

export const getDeals = async (
  connection: TCTraderConnection,
  fromTimestamp: number,
  toTimestamp: number,
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    ctidTraderAccountId: Long;
    deal: CTraderDeal[];
    hasMore: boolean;
  }
  >({
    name: 'ProtoOADealListReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
      fromTimestamp,
      toTimestamp,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_DEAL_LIST_RES,
      required: ['ctidTraderAccountId', 'hasMore'],
    },
    res,
  );

  const { deal } = res;
  return {
    ...res,
    deals: deal.map(transformDeal),
  };
};

export const newOrder = async (
  connection: TCTraderConnection,
  symbolId: string,
  orderType: CTraderOrderType,
  tradeSide: CTraderTradeSide,
  volume: number,
  options: {
    limitPrice?: number,
    stopPrice?: number,
    stopLoss?: number,
    takeProfit?: number,
    label?: string,
    comment?: string,
  },
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<CTraderExecutionEvent>({
    name: 'ProtoOANewOrderReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
      symbolId,
      orderType,
      tradeSide,
      volume: volume * 100,
      ...options,
    },
  });

  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_EXECUTION_EVENT,
      required: ['ctidTraderAccountId', 'executionType'],
    },
    res,
  );

  const { position, order } = res;
  return {
    ...res,
    order: order && transformOrder(order),
    position: position && transformPosition(position),
  };
};

export const updateOrder = async (
  connection: TCTraderConnection,
  orderId: string,
  options: {
    volume?: number,
    limitPrice?: number,
    stopPrice?: number,
    stopLoss?: number,
    takeProfit?: number,
  },
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<CTraderExecutionEvent>({
    name: 'ProtoOAAmendOrderReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
      orderId,
      ...options,
      ...(options.volume && { volume: options.volume * 100 }),
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_EXECUTION_EVENT,
      required: ['ctidTraderAccountId', 'executionType'],
    },
    res,
  );

  const { position, order } = res;
  return {
    ...res,
    order: order && transformOrder(order),
    position: position && transformPosition(position),
  };
};

export const cancelOrder = async (
  connection: TCTraderConnection,
  orderId: string,
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<CTraderExecutionEvent>({
    name: 'ProtoOACancelOrderReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
      orderId,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_EXECUTION_EVENT,
      required: ['ctidTraderAccountId', 'executionType'],
    },
    res,
  );

  const { position, order } = res;
  return {
    ...res,
    order: order && transformOrder(order),
    position: position && transformPosition(position),
  };
};

export const updatePosition = async (
  connection: TCTraderConnection,
  positionId: string,
  options: {
    stopLoss?: number,
    takeProfit?: number,
  },
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<CTraderExecutionEvent>({
    name: 'ProtoOAAmendPositionSLTPReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
      positionId,
      ...options,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_EXECUTION_EVENT,
      required: ['ctidTraderAccountId', 'executionType'],
    },
    res,
  );

  const { position, order } = res;
  return {
    ...res,
    order: order && transformOrder(order),
    position: position && transformPosition(position),
  };
};

export const closePosition = async (
  connection: TCTraderConnection,
  positionId: string,
  volume: number,
  accountId?: string,
) => {
  const res = await connection.sendGuaranteedCommand<CTraderExecutionEvent>({
    name: 'ProtoOAClosePositionReq',
    payload: {
      ctidTraderAccountId: accountId || connection.accountId,
      positionId,
      volume: volume * 100,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_EXECUTION_EVENT,
      required: ['ctidTraderAccountId', 'executionType'],
    },
    res,
  );

  const { position, order, deal } = res;
  return {
    ...res,
    order: order && transformOrder(order),
    position: position && transformPosition(position),
    deal: deal && transformDeal(deal),
  };
};
