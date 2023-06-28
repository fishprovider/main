import { CallbackType } from '~constants/openApi';
import type { BaseEvent, CallbackPayload } from '~types/Event.model';

const handleEventAccountDisconnect = (
  payload: BaseEvent,
  callback: (_: CallbackPayload) => void,
) => {
  const { ctidTraderAccountId } = payload;
  callback({
    ...payload,
    type: CallbackType.accountDisconnect,
    accountId: ctidTraderAccountId.toNumber().toString(),
  });
};

export default handleEventAccountDisconnect;
