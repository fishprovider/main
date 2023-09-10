// import { send } from '@fishprovider/old-core/dist/libs/notif';
import type { CallbackPayload } from '@fishprovider/metatrader/dist/types/Event.model';

import type { ClientAccount } from '~types/Client.model';

/*
{
  type: 'account',
  accountId: '5b05a086-65e5-4c66-9ab5-586952e3f949',
  accountInformation: {
    platform: 'mt4',
    broker: 'Exness Technologies Ltd',
    currency: 'USD',
    server: 'Exness-Trial8',
    balance: 2017.91,
    equity: 2017.7900000000002,
    margin: 13.29,
    freeMargin: 2004.5000000000002,
    leverage: 50,
    marginLevel: 15182.768999247557,
    name: 'Dev Pro',
    login: 69291513,
    credit: 0,
    tradeAllowed: true,
    investorMode: false,
    marginMode: 'ACCOUNT_MARGIN_MODE_RETAIL_HEDGING',
    type: 'ACCOUNT_TRADE_MODE_CONTEST'
  }
}
*/

const handleEventAccount = async (
  payload: CallbackPayload,
  account: ClientAccount,
) => {
  try {
    Logger.debug('handleEventAccount', account._id, payload);
    // await send(`Account event ${JSON.stringify(payload)}`, [], `p-${providerId}`);
  } catch (err) {
    Logger.error('Failed to handleEventAccount', err);
  }
};

export default handleEventAccount;
