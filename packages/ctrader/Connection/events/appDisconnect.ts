import { CallbackType } from '~constants/openApi';
import type { BaseEvent, CallbackPayload } from '~types/Event.model';

const handleEventAppDisconnect = (
  payload: BaseEvent,
  callback: (_: CallbackPayload) => void,
) => {
  callback({
    ...payload,
    type: CallbackType.appDisconnect,
  });
};

export default handleEventAppDisconnect;
