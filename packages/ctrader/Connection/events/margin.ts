import { CallbackType } from '~constants/openApi';
import type { CallbackPayload, MarginCallTriggerEvent } from '~types/Event.model';

const handleEventMargin = (
  payload: MarginCallTriggerEvent,
  callback: (_: CallbackPayload) => void,
) => {
  const { ctidTraderAccountId, marginCall } = payload;
  const { utcLastUpdateTimestamp } = marginCall;
  callback({
    ...payload,
    ...marginCall,
    type: CallbackType.margin,
    accountId: ctidTraderAccountId.toNumber().toString(),
    utcLastUpdateTimestamp: utcLastUpdateTimestamp?.toNumber(),
  });
};

export default handleEventMargin;
