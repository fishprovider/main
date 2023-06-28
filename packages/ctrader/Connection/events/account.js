import { CallbackType } from '~constants/openApi';
import { transformAccountInfo } from '~utils/transform';
const handleEventAccount = (payload, callback) => {
    const { trader } = payload;
    callback({
        ...payload,
        ...transformAccountInfo(trader),
        type: CallbackType.account,
    });
};
export default handleEventAccount;
