import type { CallbackPayload } from '~types/Event.model';
declare const handleEvents: (event: Event, callback: (_: CallbackPayload) => void) => void;
export default handleEvents;
