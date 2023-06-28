import type { CallbackPayload } from '~types/Event.model';
declare const handleEventTokenInvalid: (payload: AccountsTokenInvalidatedEvent, callback: (_: CallbackPayload) => void) => void;
export default handleEventTokenInvalid;
