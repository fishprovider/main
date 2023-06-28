import { CallbackType } from '~constants/openApi';
import type { AccountsTokenInvalidatedEvent, CallbackPayload } from '~types/Event.model';

const handleEventTokenInvalid = (
  payload: AccountsTokenInvalidatedEvent,
  callback: (_: CallbackPayload) => void,
) => {
  const { ctidTraderAccountIds } = payload;
  callback({
    ...payload,
    type: CallbackType.tokenInvalid,
    accountIds: ctidTraderAccountIds.map((item) => item.toNumber().toString()),
  });
};

export default handleEventTokenInvalid;
