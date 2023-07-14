// import { send } from '@fishprovider/core/dist/libs/notif';
import type { CallbackPayload } from '@fishprovider/ctrader/dist/types/Event.model';

import type { ClientAccount } from '~types/Client.model';

const handleEventAccount = async (
  payload: CallbackPayload,
  account: ClientAccount,
) => {
  const { _id: providerId } = account;
  Logger.debug('handleEventAccount', payload, providerId);
  try {
    // await send(`Account event ${JSON.stringify(payload)}`, [], `p-${providerId}`);
  } catch (err) {
    Logger.error('Failed to handleEventAccount', err);
  }
};

export default handleEventAccount;
