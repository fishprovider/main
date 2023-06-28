import { CallbackType } from '~constants/openApi';
import { transformLong } from '~utils/transform';
const transformDepth = ({ id, size, bid, ask, }) => ({
    id: id.toNumber().toString(),
    size: size.toNumber(),
    bid: bid && transformLong(bid, 5),
    ask: ask && transformLong(ask, 5),
});
const handleEventDepth = (payload, callback) => {
    const { ctidTraderAccountId, symbolId, newQuotes, deletedQuotes, } = payload;
    callback({
        type: CallbackType.depth,
        accountId: ctidTraderAccountId.toNumber().toString(),
        symbolId: symbolId.toNumber().toString(),
        newQuotes: newQuotes.map(transformDepth),
        deletedQuotes: deletedQuotes.map((item) => item.toNumber().toString()),
    });
};
export default handleEventDepth;
