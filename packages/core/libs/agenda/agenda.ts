import { Agenda as AgendaClient, Job } from 'agenda';

import serverCommandHandlers from '~controllers/serverCommandHandlers';
import type { Adapter } from '~types/Adapter.model';
import type { ServerCommand } from '~types/ServerCommand.model';

const env = {
  type: process.env.TYPE,
  typeId: process.env.TYPE_ID,
  typePre: process.env.TYPE_PRE,

  mongodbUri: process.env.MONGODB_URI,
  agendaCollection: process.env.AGENDA_COLLECTION || 'agenda',
};

let _agenda: AgendaClient | undefined;

const prefix = `${env.typePre}-${env.typeId}`;

const getJobType = (jobType: string) => ({
  jobType,
  type: env.type,
  typeId: env.typeId,
});

const startHeartbeat = async () => {
  const jobName = `${prefix}-heartbeat`;
  Agenda.define(
    jobName,
    {
      lockLifetime: 1000 * 10,
      priority: 10,
    },
    () => undefined,
  );

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    await Agenda.every('10 seconds', jobName, getJobType('heartbeat'), { skipImmediate: true });
  }
};

const startLocalRemote = () => {
  const jobName = `${prefix}-remote`;
  Agenda.define(
    jobName,
    {
      priority: 10,
    },
    async (job: Job<ServerCommand>) => {
      const { data } = job.attrs;
      if (data) {
        Logger.warn(`📥 Receive ${jobName}, command: ${data.command}`);
        await serverCommandHandlers(data);
      } else {
        Logger.error(`🔥 Failed at ${jobName}, data: ${job.attrs}`);
      }
    },
  );
};

const cleanupOldRestartJobs = async () => {
  const jobs = await Agenda.jobs({
    name: `${prefix}-remote`,
    'data.command': 'restart',
  });
  if (jobs.length) {
    Logger.info(`Found ${jobs.length} old restart jobs to remove`);
    jobs.forEach((job) => {
      job.remove().catch((err) => Logger.error(`Failed to remove job: ${err}`));
    });
  }
};

const cleanupCompletedJobs = async () => {
  const jobs = await Agenda.jobs({
    repeatInterval: {
      $exists: false,
    },
    failedAt: {
      $exists: false,
    },
    lastFinishedAt: {
      $exists: true,
    },
  });
  if (jobs.length) {
    Logger.info(
      `Found ${jobs.length} completed jobs to remove: ${jobs
        .map((job) => job.attrs.name)
        .join(', ')}`,
    );
    jobs.forEach((job) => {
      job.remove().catch((err) => Logger.error(`Failed to remove job: ${err}`));
    });
  }
};

const checkFailedJobs = async () => {
  const jobs = await Agenda.jobs({
    failedAt: {
      $exists: true,
    },
  });
  const failedJobs = jobs.filter(
    (job) => job.attrs?.failedAt
      && job.attrs?.lastFinishedAt
      && job.attrs.failedAt > job.attrs.lastFinishedAt,
  );
  if (failedJobs.length) {
    Logger.error(`🔥 Found ${failedJobs.length} failed jobs`);
    failedJobs.forEach((job) => {
      const {
        name, failReason, failedAt, failCount, lastFinishedAt,
      } = job.attrs;
      Logger.error(
        `🔥 - ${name}: ${failReason}, ${failedAt}, failCount: ${failCount}, lastFinishedAt: ${lastFinishedAt}`,
      );
    });
  }
};

const initialize = () => {
  if (!env.mongodbUri) {
    throw new Error('MongoDB URI is not defined');
  }

  _agenda = new AgendaClient({
    db: {
      address: env.mongodbUri,
      collection: env.agendaCollection,
      options: {
        maxPoolSize: 10,
        maxConnecting: 10,
      },
    },
    processEvery: '5 seconds',
    maxConcurrency: 10,
  });

  global.Agenda = _agenda;
};

const start = async (adapter: Adapter) => {
  await Agenda.start();

  if (adapter.enableHeartbeat) {
    startHeartbeat().catch((err) => Logger.error(`Failed to start heartbeat: ${err}`));
  }
  if (adapter.enableLocalRemote) {
    startLocalRemote();
  }
};

const clean = async () => {
  await cleanupOldRestartJobs();
  await cleanupCompletedJobs();
  await checkFailedJobs();
};

const destroy = () => {
  console.log('Agenda destroying...');
  if (_agenda) {
    _agenda.stop().catch((err) => Logger.error(`Failed to stop Agenda: ${err}`));
    _agenda.close({ force: true }).catch((err) => Logger.error(`Failed to close Agenda: ${err}`));
    _agenda = undefined;
  }
  console.log('Agenda destroyed');
};

const destroyAsync = async () => {
  console.log('Agenda destroying...');
  if (_agenda) {
    await _agenda.stop();
    await _agenda.close({ force: true });
    _agenda = undefined;
  }
  console.log('Agenda destroyed');
};

export {
  clean, destroy, destroyAsync, getJobType, initialize, start,
};
