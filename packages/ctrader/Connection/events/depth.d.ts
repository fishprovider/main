import type { CallbackPayload } from '~types/Event.model';
declare const handleEventDepth: (payload: DepthEvent, callback: (_: CallbackPayload) => void) => void;
export default handleEventDepth;
