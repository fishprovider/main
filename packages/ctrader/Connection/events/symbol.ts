import { CallbackType } from '~constants/openApi';
import type { CallbackPayload, SymbolChangedEvent } from '~types/Event.model';

const handleEventSymbol = (
  payload: SymbolChangedEvent,
  callback: (_: CallbackPayload) => void,
) => {
  const { ctidTraderAccountId, symbolId } = payload;
  callback({
    ...payload,
    type: CallbackType.symbol,
    accountId: ctidTraderAccountId.toNumber().toString(),
    symbolIds: symbolId.map((item) => item.toNumber().toString()),
  });
};

export default handleEventSymbol;
