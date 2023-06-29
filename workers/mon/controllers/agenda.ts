import { clean, getJobType } from '@fishbot/core/libs/agenda';

import checkHeartbeats from '~services/checkHeartbeats';
import writeHeartbeatFile from '~services/writeHeartbeatFile';

const env = {
  typeId: process.env.TYPE_ID,
  typePre: process.env.TYPE_PRE,
};

const prefix = `${env.typePre}-${env.typeId}`;

const startHeartbeatImmortal = async () => {
  const jobName = `${prefix}-heartbeat`;
  Agenda.define(
    jobName,
    { lockLifetime: 1000 * 10 },
    writeHeartbeatFile,
  );

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    await Agenda.every('10 seconds', jobName, getJobType('heartbeat'), {
      skipImmediate: true,
    });
  }
};

const startCheckHeartbeats = async () => {
  const jobName = `${prefix}-check-heartbeat`;
  Agenda.define(
    jobName,
    { lockLifetime: 1000 * 30 },
    checkHeartbeats,
  );

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    await Agenda.every('30 seconds', jobName, getJobType('check-heartbeat'), {
      skipImmediate: true,
    });
  }
};

const start = async () => {
  await clean();
  await startHeartbeatImmortal();
  await startCheckHeartbeats();
};

export {
  start,
};
