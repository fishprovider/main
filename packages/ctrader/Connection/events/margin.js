import { CallbackType } from '~constants/openApi';
const handleEventMargin = (payload, callback) => {
    const { ctidTraderAccountId, marginCall } = payload;
    const { utcLastUpdateTimestamp } = marginCall;
    callback({
        ...payload,
        ...marginCall,
        type: CallbackType.margin,
        accountId: ctidTraderAccountId.toNumber().toString(),
        utcLastUpdateTimestamp: utcLastUpdateTimestamp?.toNumber(),
    });
};
export default handleEventMargin;
