import { AccountPlatform, ProviderType } from '@fishprovider/utils/dist/constants/account';
import type { Account, Config } from '@fishprovider/utils/dist/types/Account.model';

import getAccountInfoCTrader from '~libs/ctrader/commands/getAccountInfo';
import getAccountInfoMetaTrader from '~libs/metatrader/commands/getAccountInfo';
import { updateCache } from '~utils/account';
import { getAssets } from '~utils/price';

interface AccountInfoReqOptions {
  config?: Config,
  connection?: any,
  accountId?: string,
}

interface AccountInfoReq {
  providerId: string,
  providerType: ProviderType,
  accountPlatform: AccountPlatform,
  options?: AccountInfoReqOptions,
}

interface AccountInfoRes {
  leverage: number;
  balance: number;
  margin?: number;
  assetId?: string;
  asset?: string;
  providerData: Record<string, any>;
  updatedAt: Date;
}

const saveAccountInfo = async (
  providerId: string,
  providerType: ProviderType,
  res: AccountInfoRes,
) => {
  const account = await Mongo.collection<Account>('accounts').findOne({
    _id: providerId,
  }, {
    projection: {
      providerData: 0,
    },
  });
  if (!account) {
    throw new Error(`Account not found ${providerId}`);
  }

  const getAssetInfo = async () => {
    if (!res.asset && !res.assetId) return undefined;

    const { assetIds, assetNames } = await getAssets(providerType);
    return {
      ...(res.asset && {
        assetId: assetNames[res.asset],
      }),
      ...(res.assetId && {
        asset: assetIds[res.assetId],
      }),
    };
  };
  const assetInfo = await getAssetInfo();

  const accountInfo = {
    ...account,
    ...res,
    ...assetInfo,
  };
  updateCache(accountInfo); // non-blocking

  return accountInfo;
};

const fetchAccountInfo = async (req: AccountInfoReq) => {
  const {
    providerId, providerType, accountPlatform, options,
  } = req;

  let res: AccountInfoRes;
  switch (accountPlatform) {
    case AccountPlatform.ctrader: {
      res = await getAccountInfoCTrader({ ...req, ...options });
      break;
    }
    case AccountPlatform.metatrader: {
      res = await getAccountInfoMetaTrader({ ...req, ...options });
      break;
    }
    default: {
      throw new Error(`Unhandled accountPlatform ${accountPlatform}`);
    }
  }

  const accountInfo = await saveAccountInfo(providerId, providerType, res);
  return accountInfo;
};

export default fetchAccountInfo;
