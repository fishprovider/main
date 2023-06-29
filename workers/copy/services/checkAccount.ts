import { getLiveOrders } from '@fishbot/swap/utils/order';
import type { Account, CopySettings } from '@fishbot/utils/types/Account.model';
import _ from 'lodash';

import type { OrderCopy } from '~types/Order.model';
import { copyTasks, getAccount } from '~utils/account';

// import checkEquitySL from './copiers/checkEquitySL';
import copyNewOrders from './copiers/copyNewOrders';
import removeClosedOrders from './copiers/removeClosedOrders';
import removeDuplicatedOrders from './copiers/removeDuplicatedOrders';
import setCopyVolumeRatio from './copiers/setCopyVolumeRatio';
import updateSLTP from './copiers/updateSLTP';

const copyProvider = async (
  account: Account,
  copyOrders: OrderCopy[],
  parentId: string,
  copySettings: CopySettings,
) => {
  try {
    if (!copySettings.enableCopy) return;

    const parentOrders = await getLiveOrders(parentId);

    if (copyTasks.removeClosedOrders) {
      await removeClosedOrders(account, copyOrders, parentId, copySettings, parentOrders);
    }
    if (copyTasks.copyNewOrders) {
      await copyNewOrders(account, copyOrders, parentId, copySettings, parentOrders);
    }
    if (copyTasks.updateSLTP) {
      await updateSLTP(account, copyOrders, parentId, copySettings, parentOrders);
    }
    // if (copyTasks.checkEquitySL) {
    //   await checkEquitySL(account, copyOrders, copySettings);
    // }
  } catch (err) {
    Logger.error(`Failed at copyProvider from ${account._id} to ${parentId}`, err);
  }
};

const checkAccount = async (providerId: string) => {
  try {
    Logger.debug('🎡 Running account', providerId);

    const account = await getAccount(providerId);
    if (!account?.settings) return;
    const { enableCopyParent, parents } = account.settings;
    if (!enableCopyParent || !parents
        || !_.size(parents)
        || !_.some(parents, (item) => !!item.enableCopy)
    ) return;

    const liveOrders = await getLiveOrders(providerId);
    const copyOrders = liveOrders.filter((item) => item.copyId) as OrderCopy[];

    await removeDuplicatedOrders(account, copyOrders);
    await setCopyVolumeRatio(account, copyOrders, parents);

    for (const [parentId, copySettings] of Object.entries(parents)) {
      await copyProvider(account, copyOrders, parentId, copySettings);
    }
  } catch (err) {
    Logger.error(`Failed to checkAccount ${providerId}`, err);
  }
};

export default checkAccount;
