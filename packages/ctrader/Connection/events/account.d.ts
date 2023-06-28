import type { CallbackPayload } from '~types/Event.model';
declare const handleEventAccount: (payload: TraderUpdatedEvent, callback: (_: CallbackPayload) => void) => void;
export default handleEventAccount;
