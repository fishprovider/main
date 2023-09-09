import { clean, getJobType } from '@fishprovider/old-core/dist/libs/agenda';
import { ProviderTradeType } from '@fishprovider/utils/dist/constants/account';
import type { Job, JobAttributesData } from 'agenda';

import { destroyOne, renewTokens, startOne } from '~services/provider';

const env = {
  typeId: process.env.TYPE_ID,
  typePre: process.env.TYPE_PRE,
  providerTradeType: process.env.PROVIDER_TRADE_TYPE || ProviderTradeType.demo,
};

interface StartProvider extends JobAttributesData {
  providerId?: string;
}

interface DestroyProvider extends JobAttributesData {
  providerId?: string;
}

const prefix = `${env.typePre}-${env.typeId}`;

const startRenewTokens = async () => {
  const jobName = `${prefix}-renew-tokens`;
  Agenda.define(
    jobName,
    { lockLifetime: 1000 * 60 * 60 * 24 * 7 },
    () => renewTokens(),
  );
  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    // 11:00 Sat UTC+0
    await Agenda.every('0 11 * * 6', jobName, getJobType('renew-tokens'), {
      skipImmediate: true,
    });
  }
};

const startProvider = async () => {
  const jobName = `${env.typePre}-${env.providerTradeType}-head-start-provider`;
  Agenda.define(
    jobName,
    {},
    async (job: Job<StartProvider>) => {
      const { data } = job.attrs;
      if (data?.providerId) {
        await startOne(data?.providerId);
      } else {
        Logger.error(`🔥 Failed at ${jobName}, data: ${job.attrs}`);
      }
    },
  );
};

const destroyProvider = async () => {
  const jobName = `${env.typePre}-${env.providerTradeType}-head-destroy-provider`;
  Agenda.define(
    jobName,
    {},
    async (job: Job<DestroyProvider>) => {
      const { data } = job.attrs;
      if (data?.providerId) {
        await destroyOne(data?.providerId);
      } else {
        Logger.error(`🔥 Failed at ${jobName}, data: ${job.attrs}`);
      }
    },
  );
};

const start = async () => {
  await clean();
  await startRenewTokens();
  await startProvider();
  await destroyProvider();
};

export {
  start,
};
