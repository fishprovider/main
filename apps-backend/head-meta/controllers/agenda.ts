import { clean } from '@fishprovider/old-core/dist/libs/agenda';
import { AccountTradeType } from '@fishprovider/utils/dist/constants/account';
import type { Job, JobAttributesData } from 'agenda';

import { destroyOne, startOne } from '~services/provider';

const env = {
  typeId: process.env.TYPE_ID,
  typePre: process.env.TYPE_PRE,
  tradeType: process.env.PROVIDER_TRADE_TYPE || AccountTradeType.demo,
};

interface StartProvider extends JobAttributesData {
  providerId?: string;
}

interface DestroyProvider extends JobAttributesData {
  providerId?: string;
}

const startProvider = async () => {
  const jobName = `${env.typePre}-${env.tradeType}-head-meta-start-provider`;
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
  const jobName = `${env.typePre}-${env.tradeType}-head-meta-destroy-provider`;
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
  await startProvider();
  await destroyProvider();
};

export {
  start,
};
