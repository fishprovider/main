import type { Job } from 'agenda';

import { sendRemoteInstance, setRemoteInstance } from '~utils/instance';

const env = {
  type: process.env.TYPE,
  typeId: process.env.TYPE_ID,
  typeIds: process.env.TYPE_IDS || '',
  typePre: process.env.TYPE_PRE,
  dryRun: process.env.DRY_RUN,
};

const timeoutMS = 1000 * 30;
const lostCounts: Record<string, number> = {};

const checkHeartbeats = async () => {
  const jobs = await Agenda.jobs({
    'data.jobType': 'heartbeat',
  });

  const heartbeats: Job[] = [];
  env.typeIds.split(',').forEach((envTypeId) => {
    const heartbeat = jobs.find(
      (job) => {
        const { type, typeId } = job.attrs.data || {};
        return type === env.type && typeId === envTypeId;
      },
    );
    if (heartbeat) {
      heartbeats.push(heartbeat);
    } else {
      Logger.error(`🔥 No heartbeat from ${env.type} ${envTypeId}`);
    }
  });

  heartbeats.forEach(({ attrs }) => {
    const { lastFinishedAt, data } = attrs;
    const { typeId } = data || {};

    if (!lostCounts[typeId]) {
      lostCounts[typeId] = 0;
    }
    setRemoteInstance(typeId);

    const now = Date.now();
    const range = lastFinishedAt ? now - new Date(lastFinishedAt).getTime() : 0;

    if (range < timeoutMS) {
      lostCounts[typeId] = 0;
    } else {
      const count = lostCounts[typeId] || 0;
      if (count < 20) {
        lostCounts[typeId] += 1;

        if (count === 10) {
          Logger.error(
            `🔥 Lost heartbeat too many times since ${lastFinishedAt}, restarting... ${typeId}`,
          );
          if (env.dryRun) return;
          sendRemoteInstance(typeId, 'restart');
        }
      } else {
        lostCounts[typeId] = 0;

        if (count === 20) {
          Logger.error(
            `🔥 Lost heartbeat too many times since ${lastFinishedAt}, restarting process... ${typeId}`,
          );
          if (env.dryRun) return;
          sendRemoteInstance(typeId, 'restartProcess');
        }
      }
    }
  });
};

export default checkHeartbeats;
