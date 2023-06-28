import { CallbackType } from '~constants/openApi';
import type { CallbackPayload, Event } from '~types/Event.model';

const handleEventUnhandled = (
  event: Event,
  callback: (_: CallbackPayload) => void,
) => {
  callback({
    type: CallbackType.unhandled,
    event,
  });
};

export default handleEventUnhandled;
