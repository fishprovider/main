import { CacheFirstAccountRepository, CacheFirstUserRepository } from '@fishprovider/cache-first';
import {
  Account, AccountPlatform, AccountTradeType, ProviderType,
} from '@fishprovider/core';
import { addAccountService } from '@fishprovider/core-backend';
import { TradeAccountRepository } from '@fishprovider/trade';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const env = {
  typePre: process.env.TYPE_PRE,
};

const handler: ApiHandler<Partial<Account>> = async (data, userSession) => {
  const payload = z.object({
    name: z.string(),
    providerType: z.nativeEnum(ProviderType),
    accountPlatform: z.nativeEnum(AccountPlatform),
    accountTradeType: z.nativeEnum(AccountTradeType),
    baseConfig: z.object({
      clientId: z.string().optional(),
      clientSecret: z.string().optional(),
      accountId: z.string().optional(),
      accountNumber: z.string().optional(),
      name: z.string().optional(),
      user: z.string().optional(),
      pass: z.string().optional(),
      isLive: z.boolean().optional(),
      // ct
      host: z.string().optional(),
      port: z.number().optional(),
      accessToken: z.string().optional(),
      refreshToken: z.string().optional(),
      // mt
      platform: z.string().optional(),
      server: z.string().optional(),
    }).strict(),
  }).strict()
    .parse(data);

  const {
    name, providerType, accountPlatform, accountTradeType, baseConfig,
  } = payload;

  const { doc: account = {} } = await addAccountService({
    payload: {
      name,
      providerType,
      accountPlatform,
      accountTradeType,
      baseConfig,
    },
    repositories: {
      account: CacheFirstAccountRepository,
      trade: TradeAccountRepository,
      user: CacheFirstUserRepository,
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

  return { result: account };
};

export default handler;
