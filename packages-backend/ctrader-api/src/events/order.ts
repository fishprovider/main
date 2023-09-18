import {
  CTraderCallbackPayload, CTraderCallbackType, CTraderExecutionEvent,
  transformDeal, transformDepositWithdraw, transformOrder, transformPosition,
} from '..';

export const handleEventOrder = (
  payload: CTraderExecutionEvent,
  callback: (_: CTraderCallbackPayload) => void,
) => {
  const {
    ctidTraderAccountId, position, order, deal, depositWithdraw,
  } = payload;
  callback({
    ...payload,
    type: CTraderCallbackType.order,
    accountId: ctidTraderAccountId.toNumber().toString(),
    depositWithdraw: depositWithdraw && transformDepositWithdraw(depositWithdraw),
    order: order && transformOrder(order),
    position: position && transformPosition(position),
    deal: deal && transformDeal(deal),
  });
};
