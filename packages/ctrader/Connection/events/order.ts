import { CallbackType } from '~constants/openApi';
import type { DepositWithdraw } from '~types/Account.model';
import type { CallbackPayload, ExecutionEvent } from '~types/Event.model';
import {
  transformDeal,
  transformLong,
  transformOrder,
  transformPosition,
} from '~utils/transform';

const transformDepositWithdraw = (depositWithdraw: DepositWithdraw) => {
  const {
    balanceHistoryId, balance, delta, changeBalanceTimestamp,
    balanceVersion, equity, moneyDigits,
  } = depositWithdraw;
  return {
    ...depositWithdraw,
    balanceHistoryId: balanceHistoryId.toNumber().toString(),
    balance: transformLong(balance, moneyDigits),
    delta: transformLong(delta, moneyDigits),
    changeBalanceTimestamp: changeBalanceTimestamp.toNumber(),
    balanceVersion: balanceVersion && balanceVersion.toNumber(),
    equity: equity && transformLong(equity, moneyDigits),
  };
};

const handleEventOrder = (
  payload: ExecutionEvent,
  callback: (_: CallbackPayload) => void,
) => {
  const {
    ctidTraderAccountId, position, order, deal, depositWithdraw,
  } = payload;
  callback({
    ...payload,
    type: CallbackType.order,
    accountId: ctidTraderAccountId.toNumber().toString(),
    depositWithdraw: depositWithdraw && transformDepositWithdraw(depositWithdraw),
    order: order && transformOrder(order),
    position: position && transformPosition(position),
    deal: deal && transformDeal(deal),
  });
};

export default handleEventOrder;
