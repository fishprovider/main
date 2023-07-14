import { ProviderPlatform, ProviderType } from '@fishprovider/utils/dist/constants/account';
import type { Config } from '@fishprovider/utils/dist/types/Account.model';
import type { Order, OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';

import getDealsCTrader from '~libs/ctrader/commands/getDeals';
import getDealsMetaTrader from '~libs/metatrader/commands/getDeals';
import { findRequestOrder, findRequestOrders } from '~utils/command';
import { getDealsKey } from '~utils/order';

interface FetchDealsReqOptions {
  config?: Config,
  connection?: any,
  accountId?: string,
  weeks?: number,
  days?: number,
  from?: number,
  to?: number,
}

interface FetchDealsReq {
  providerId: string,
  providerType: ProviderType,
  providerPlatform: ProviderPlatform,
  options?: FetchDealsReqOptions,
}

interface FetchDealsRes {
  deals: OrderWithoutId[];
  hasMore?: boolean;
  weeks?: number;
  days?: number;
  from?: number;
  to?: number;
  providerData?: Record<string, any>;
  updatedAt: Date;
}

const saveDeals = async (
  providerId: string,
  res: FetchDealsRes,
) => {
  const { deals } = res;

  const requestOrders = await findRequestOrders(providerId, deals);
  const finalDeals = [];
  const slimDeals: Order[] = [];

  for (const deal of deals) {
    const requestOrder = await findRequestOrder(deal, requestOrders);
    requestOrders[requestOrder._id] = requestOrder;
    finalDeals.push(requestOrder);
    slimDeals.push(_.omit(requestOrder, ['providerData', 'updatedLogs']));
  }

  const updateRedis = async () => {
    const key = getDealsKey(providerId, res);
    const dealsStr = JSON.stringify(slimDeals);
    await Promise.all([
      Redis.publish(key, dealsStr),
      Redis.set(key, dealsStr, {
        EX: 60 * 60 * 24,
      }),
    ]);
  };
  updateRedis(); // non-blocking

  return finalDeals;
};

const fetchDeals = async (req: FetchDealsReq) => {
  const {
    providerId, providerPlatform, options,
  } = req;

  let res: FetchDealsRes;
  switch (providerPlatform) {
    case ProviderPlatform.ctrader: {
      res = await getDealsCTrader({ ...req, ...options });
      break;
    }
    case ProviderPlatform.metatrader: {
      res = await getDealsMetaTrader({ ...req, ...options });
      break;
    }
    default: {
      throw new Error(`Unhandled providerPlatform ${providerPlatform}`);
    }
  }

  const deals = await saveDeals(
    providerId,
    res,
  );

  return {
    ...res,
    deals,
  };
};

export default fetchDeals;
