import type { CallbackPayload } from '~types/Event.model';
declare const handleEventUnhandled: (event: Event, callback: (_: CallbackPayload) => void) => void;
export default handleEventUnhandled;
