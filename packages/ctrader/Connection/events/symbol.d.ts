import type { CallbackPayload } from '~types/Event.model';
declare const handleEventSymbol: (payload: SymbolChangedEvent, callback: (_: CallbackPayload) => void) => void;
export default handleEventSymbol;
