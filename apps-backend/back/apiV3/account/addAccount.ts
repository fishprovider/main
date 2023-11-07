import {
  Account, AccountPlatform, AccountTradeType, AccountType,
} from '@fishprovider/core';
import { addAccountService } from '@fishprovider/core-backend';
import { CTraderAccountRepository } from '@fishprovider/ctrader-api';
import { MongoAccountRepository, MongoUserRepository } from '@fishprovider/mongo';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const env = {
  typePre: process.env.TYPE_PRE,
};

const handler: ApiHandler<Partial<Account>> = async (data, userSession) => {
  const filter = z.object({
    name: z.string(),
    accountType: z.nativeEnum(AccountType),
    accountPlatform: z.nativeEnum(AccountPlatform),
    accountTradeType: z.nativeEnum(AccountTradeType),
    baseConfig: z.object({
      // ct
      clientId: z.string().optional(),
      accountId: z.string().optional(),
      accessToken: z.string().optional(),
      refreshToken: z.string().optional(),
      // mt
      user: z.string().optional(),
      pass: z.string().optional(),
      platform: z.string().optional(),
      server: z.string().optional(),
    }),
  }).strict()
    .parse(data);

  const {
    name, accountType, accountPlatform, accountTradeType, baseConfig,
  } = filter;

  const { doc: account = {} } = await addAccountService({
    payload: {
      name,
      accountType,
      accountPlatform,
      accountTradeType,
      baseConfig,
    },
    repositories: {
      account: MongoAccountRepository,
      trade: CTraderAccountRepository,
      user: MongoUserRepository,
    },
    context: { userSession },
  });

  switch (accountPlatform) {
    case AccountPlatform.ctrader: {
      Agenda.now(`${env.typePre}-${accountTradeType}-head-start-provider`, {
        providerId: account._id,
      });
      break;
    }
    case AccountPlatform.metatrader: {
      Agenda.now(`${env.typePre}-${accountTradeType}-head-meta-start-provider`, {
        providerId: account._id,
      });
      break;
    }
    default:
  }

  return {};
};

export default handler;
