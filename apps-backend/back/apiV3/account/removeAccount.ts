import { Account, AccountPlatform } from '@fishprovider/core';
import { removeAccountService } from '@fishprovider/core-backend';
import { CTraderAccountRepository } from '@fishprovider/ctrader-api';
import { MongoAccountRepository, MongoUserRepository } from '@fishprovider/mongo';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const env = {
  typePre: process.env.TYPE_PRE,
};

const handler: ApiHandler<Partial<Account>> = async (data, userSession) => {
  const filter = z.object({
    accountId: z.string(),
  }).strict()
    .parse(data);

  const { accountId } = filter;

  const { doc: account = {} } = await removeAccountService({
    filter: { accountId },
    repositories: {
      account: MongoAccountRepository,
      trade: CTraderAccountRepository,
      user: MongoUserRepository,
    },
    context: { userSession },
  });

  const { accountPlatform, accountTradeType } = account;
  switch (accountPlatform) {
    case AccountPlatform.ctrader: {
      Agenda.now(`${env.typePre}-${accountTradeType}-head-destroy-provider`, {
        providerId: accountId,
      });
      break;
    }
    case AccountPlatform.metatrader: {
      Agenda.now(`${env.typePre}-${accountTradeType}-head-meta-destroy-provider`, {
        providerId: accountId,
      });
      break;
    }
    default:
  }

  return {};
};

export default handler;
