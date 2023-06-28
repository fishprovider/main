import { CallbackType } from '~constants/openApi';
import type { CallbackPayload, TraderUpdatedEvent } from '~types/Event.model';
import { transformAccountInfo } from '~utils/transform';

const handleEventAccount = (
  payload: TraderUpdatedEvent,
  callback: (_: CallbackPayload) => void,
) => {
  const { trader } = payload;
  callback({
    ...payload,
    ...transformAccountInfo(trader),
    type: CallbackType.account,
  });
};

export default handleEventAccount;
