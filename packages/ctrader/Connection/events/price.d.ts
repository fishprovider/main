import type { CallbackPayload } from '~types/Event.model';
declare const handleEventPrice: (payload: SpotEvent, callback: (_: CallbackPayload) => void) => void;
export default handleEventPrice;
