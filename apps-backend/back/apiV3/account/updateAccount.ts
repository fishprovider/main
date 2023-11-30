import { CacheFirstAccountRepository } from '@fishprovider/cache-first';
import {
  Account, AccountCopyVolumeMode, AccountRole, AccountViewType,
} from '@fishprovider/core';
import { updateAccountService } from '@fishprovider/core-backend';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const updateAccount: ApiHandler<Partial<Account>> = async (data, userSession) => {
  const filter = z.object({
    accountId: z.string(),
    payload: z.object({
      viewType: z.nativeEnum(AccountViewType).optional(),
      name: z.string().optional(),
      icon: z.string().optional(),
      strategyId: z.string().optional(),
      notes: z.string().optional(),
      privateNotes: z.string().optional(),
      bannerStatus: z.object({
        enabled: z.boolean().optional(),
        note: z.string().optional(),
        bgColor: z.string().optional(),
      }).strict().optional(),
      tradeSettings: z.object({
        enabledCloseProfit: z.boolean().optional(),
        takeProfit: z.number().optional(),
        stopLoss: z.number().optional(),
        enabledCloseEquity: z.boolean().optional(),
        targetEquity: z.number().optional(),
        stopEquity: z.number().optional(),
        enabledCloseTime: z.boolean().optional(),
        closeTime: z.string().transform((_) => new Date(_)).optional(),
        closeTimeIfProfit: z.boolean().optional(),
      }).strict().optional(),
      protectSettings: z.object({
        enabledEquityLock: z.boolean().optional(),
        equityLock: z.number().optional(),
        equityLockHours: z.number().optional(),
      }).strict().optional(),
      settings: z.object({
        enableCopyParent: z.boolean().optional(),
        parents: z.record(z.object({
          enableCopy: z.boolean().optional(),
          enableCopyOrderClose: z.boolean().optional(),
          enableCopyOrderSLTP: z.boolean().optional(),
          copyVolumeMode: z.nativeEnum(AccountCopyVolumeMode).optional(),
          copyVolumeRatioFixed: z.number().optional(),
          copyVolumeLotFixed: z.number().optional(),
          copyVolumeRatioAuto: z.number().optional(),
          copyVolumeLotMin: z.number().optional(),
          copyVolumeLotMax: z.number().optional(),
          enabledEquitySL: z.boolean().optional(),
          equitySLRatio: z.number().optional(),
        }).strict()).optional(),
        copyVolumeRatio: z.number().optional(),
      }).strict().optional(),
      addActivity: z.object({
        userId: z.string().optional(),
        lastView: z.string().transform((_) => new Date(_)).optional(),
      }).strict().optional(),
      addMember: z.object({
        email: z.string(),
        role: z.nativeEnum(AccountRole),
        name: z.string(),
      }).strict().optional(),
      removeMemberEmail: z.string().optional(),
    }).strict(),
    options: z.object({
      projection: z.record(z.any()).optional(),
    }).strict().optional(),
  }).strict()
    .parse(data);

  const { accountId, payload, options } = filter;

  const { doc } = await updateAccountService({
    filter: { accountId },
    payload,
    repositories: {
      account: CacheFirstAccountRepository,
    },
    options: {
      projection: options?.projection,
      returnAfter: true,
    },
    context: { userSession },
  });

  return { result: doc };
};

export default updateAccount;
