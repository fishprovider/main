import { CacheFirstAccountRepository, CacheFirstUserRepository } from '@fishprovider/cache-first';
import { Account, AccountPlatform } from '@fishprovider/core';
import { removeAccountService } from '@fishprovider/core-backend';
import { TradeAccountRepository } from '@fishprovider/trade';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const env = {
  typePre: process.env.TYPE_PRE,
};

const removeAccount: ApiHandler<Partial<Account>> = async (data, userSession) => {
  const input = z.object({
    filter: z.object({
      accountId: z.string(),
    }).strict(),
  }).strict()
    .parse(data);

  const { filter } = input;

  const { doc: account = {} } = await removeAccountService({
    filter,
    repositories: {
      account: CacheFirstAccountRepository,
      trade: TradeAccountRepository,
      user: CacheFirstUserRepository,
    },
    context: { userSession },
  });

  const { accountId } = filter;
  const { platform, tradeType } = account;

  // TODO: move to service
  switch (platform) {
    case AccountPlatform.ctrader: {
      Agenda.now(`${env.typePre}-${tradeType}-head-destroy-provider`, {
        providerId: accountId,
      });
      break;
    }
    case AccountPlatform.metatrader: {
      Agenda.now(`${env.typePre}-${tradeType}-head-meta-destroy-provider`, {
        providerId: accountId,
      });
      break;
    }
    default:
  }

  return {};
};

export default removeAccount;
