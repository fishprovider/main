import { CallbackType } from '~constants/openApi';
const handleEventSymbol = (payload, callback) => {
    const { ctidTraderAccountId, symbolId } = payload;
    callback({
        ...payload,
        type: CallbackType.symbol,
        accountId: ctidTraderAccountId.toNumber().toString(),
        symbolIds: symbolId.map((item) => item.toNumber().toString()),
    });
};
export default handleEventSymbol;
