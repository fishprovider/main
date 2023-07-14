import { send } from '@fishprovider/core/dist/libs/notif';
import { getProvider } from '@fishprovider/swap/dist/utils/account';
import { isLastRunExpired } from '@fishprovider/utils/dist/helpers/lastRunChecks';
import type { Account, CopySettings } from '@fishprovider/utils/dist/types/Account.model';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';

const runs = {};

const setCopyVolumeRatio = async (
  account: Account,
  orders: Order[],
  parents: Record<string, CopySettings>,
) => {
  const {
    _id: providerId,
    balance = 0,
    settings = {},
  } = account;
  const { copyVolumeRatio } = settings;

  const orderIds = orders.map((item) => item._id);
  if (
    !isLastRunExpired({
      runs,
      runId: providerId,
      timeUnit: 'minutes',
      timeAmt: 5,
      checkIds: orderIds,
    })
  ) return;

  if (_.size(parents) > 1) {
    if (!copyVolumeRatio || copyVolumeRatio === 1) return;

    await Mongo.collection<Account>('accounts').updateOne(
      { _id: providerId },
      {
        $unset: {
          'settings.copyVolumeRatio': '',
        },
        $set: {
          updatedAt: new Date(),
        },
      },
    );
    return;
  }

  const parentId = _.keys(parents)[0] as string;
  const parentAccount = await getProvider(parentId);
  if (!parentAccount?.balance) return;

  const newRatio = _.round(balance / parentAccount.balance, 2);
  if (newRatio !== copyVolumeRatio) {
    const msg = `[copy] Set copyVolumeRatio from ${copyVolumeRatio} to ${newRatio}=${balance}/${parentAccount.balance}`;
    Logger.debug(`[${providerId}] ${msg}`);
    send(msg, [], `p-${providerId}`);

    await Mongo.collection<Account>('accounts').updateOne(
      { _id: providerId },
      {
        $set: {
          'settings.copyVolumeRatio': newRatio,
          updatedAt: new Date(),
        },
      },
    );

    // !!! Important note: this will mutate the account shared across functions
    _.set(account, 'settings.copyVolumeRatio', newRatio);
  }
};

export default setCopyVolumeRatio;
