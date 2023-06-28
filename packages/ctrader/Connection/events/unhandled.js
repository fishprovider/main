import { CallbackType } from '~constants/openApi';
const handleEventUnhandled = (event, callback) => {
    callback({
        type: CallbackType.unhandled,
        event,
    });
};
export default handleEventUnhandled;
