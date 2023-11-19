import { CacheFirstAccountRepository } from '@fishprovider/cache-first';
import { Account, AccountViewType } from '@fishprovider/core';
import { updateAccountService } from '@fishprovider/core-backend';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account>> = async (data, userSession) => {
  const filter = z.object({
    accountId: z.string(),
    payload: z.object({
      accountViewType: z.nativeEnum(AccountViewType).optional(),
      name: z.string().optional(),
      icon: z.string().optional(),
      strategyId: z.string().optional(),
      notes: z.string().optional(),
      privateNotes: z.string().optional(),
      tradeSettings: z.object({}).optional(), // TODO: implement object details
      protectSettings: z.object({}).optional(), // TODO: implement object details
      settings: z.object({}).optional(), // TODO: implement object details
      bannerStatus: z.object({
        enabled: z.boolean().optional(),
        note: z.string().optional(),
        bgColor: z.string().optional(),
      }).strict().optional(),
      addActivity: z.object({
        userId: z.string().optional(),
        lastView: z.date().optional(),
      }).strict().optional(),
    }).strict(),
  }).strict()
    .parse(data);

  const { accountId, payload } = filter;

  const { doc } = await updateAccountService({
    filter: { accountId },
    payload,
    repositories: {
      account: CacheFirstAccountRepository,
    },
    context: { userSession },
  });

  return { result: doc };
};

export default handler;
