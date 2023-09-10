import type { CallbackPayload } from '@fishprovider/ctrader/dist/types/Event.model';
import { send } from '@fishprovider/old-core/dist/libs/notif';

import type { ClientAccount } from '~types/Client.model';

const handleEventMargin = async (
  payload: CallbackPayload,
  account: ClientAccount,
) => {
  const { marginLevelThreshold } = payload;
  const { _id: providerId } = account;
  try {
    await send(`Margin ${marginLevelThreshold * 100}%`, [], `p-${providerId}`);
  } catch (err) {
    Logger.error('Failed to handleEventMargin', err);
  }
};

export default handleEventMargin;
