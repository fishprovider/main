import { CallbackType } from '~constants/openApi';
const handleEventAccountDisconnect = (payload, callback) => {
    const { ctidTraderAccountId } = payload;
    callback({
        ...payload,
        type: CallbackType.accountDisconnect,
        accountId: ctidTraderAccountId.toNumber().toString(),
    });
};
export default handleEventAccountDisconnect;
