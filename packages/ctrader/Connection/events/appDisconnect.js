import { CallbackType } from '~constants/openApi';
const handleEventAppDisconnect = (payload, callback) => {
    callback({
        ...payload,
        type: CallbackType.appDisconnect,
    });
};
export default handleEventAppDisconnect;
