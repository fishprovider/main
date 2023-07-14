import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import type { Page } from 'puppeteer-core';

import getStrategyInfo from '~utils/getStrategyInfo';
import gotoProviderPage from '~utils/gotoProviderPage';
import login from '~utils/login';

const env = {
  nodeEnv: process.env.NODE_ENV,
  ctraderUser: process.env.CTRADER_USER || '',
  ctraderPass: process.env.CTRADER_PASS || '',
};

const fetchAccount = async (account: Account, page: Page) => {
  const { _id, strategyId = '' } = account;
  Logger.info(`[StrategyInfo] Start ${_id}, ${strategyId}`);
  try {
    await gotoProviderPage(page, strategyId);
    const strategyInfo = await getStrategyInfo(page);
    Logger.debug(`[StrategyInfo] ${JSON.stringify(strategyInfo)}`);

    const strategyInfoFields: Record<string, any> = {};
    Object.keys(strategyInfo).forEach((key) => {
      if (key && strategyInfo[key]) {
        strategyInfoFields[`summary.${key}`] = strategyInfo[key];
        if (key === 'roi') {
          strategyInfoFields.roi = strategyInfo[key];
        }
      }
    });
    await Mongo.collection<Account>('accounts').updateOne(
      { _id },
      {
        $set: {
          updatedAt: new Date(),
          ...strategyInfoFields,
        },
      },
    );
  } catch (error) {
    Logger.warn(`[StrategyInfo] Failed at fetchAccount ${_id}`, error);
  }
};

const fetchAccounts = async (accounts: Account[]) => {
  let browserObj;
  try {
    const { browser, page } = await login({
      user: env.ctraderUser, pass: env.ctraderPass,
    });
    browserObj = browser;

    for (const account of accounts) {
      await fetchAccount(account, page);
    }
  } catch (error) {
    Logger.error('[StrategyInfo] Failed at fetchAccounts', error);
  } finally {
    if (browserObj) {
      browserObj.close();
    }
  }
};

const getStrategyInfos = async () => {
  const accounts = await Mongo.collection<Account>('accounts').find(
    {
      providerType: ProviderType.icmarkets,
      strategyId: { $exists: true, $ne: '' },
      deleted: { $ne: true },
    },
    {
      projection: {
        config: 1,
        strategyId: 1,
      },
      sort: {
        order: -1,
      },
    },
  )
    .toArray();
  if (!accounts.length) return;

  await fetchAccounts(accounts);
};

export default getStrategyInfos;
