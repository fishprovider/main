import { CallbackType } from '~constants/openApi';
const handleEventTokenInvalid = (payload, callback) => {
    const { ctidTraderAccountIds } = payload;
    callback({
        ...payload,
        type: CallbackType.tokenInvalid,
        accountIds: ctidTraderAccountIds.map((item) => item.toNumber().toString()),
    });
};
export default handleEventTokenInvalid;
