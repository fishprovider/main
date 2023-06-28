import _ from 'lodash';
import si from 'systeminformation';

import { send } from '~libs/notif';

const env = {
  type: process.env.TYPE,
  typeId: process.env.TYPE_ID,
  typePre: process.env.TYPE_PRE,
  slackChannelApps: process.env.SLACK_CHANNEL_APPS || `${process.env.TYPE_PRE}-apps`,
};

const start = async () => {
  // const time = await si.time();
  const system = await si.system();
  const osInfo = await si.osInfo();
  const networkInterfaces = await si.networkInterfaces();
  const users = await si.users();

  const os = `${osInfo.distro}, ${osInfo.hostname}`;
  const ipAddress = (_.isArray(networkInterfaces) ? networkInterfaces : [networkInterfaces])
    .filter((item) => item.operstate === 'up')
    .map((item) => item.ip4);
  const user = users.map((item) => item.user);
  send(
    `🚗 ${env.typePre}-${env.typeId} started at ${ipAddress} by ${user} on ${os}`,
    [],
    env.slackChannelApps,
  );

  const _id = `${env.type}-${env.typeId}-${system.uuid}`;
  await Mongo.collection<{ _id: string }>('sysinfo').updateOne(
    {
      _id,
    },
    {
      $set: {
        updatedAt: new Date(),
        system,
        osInfo,
        users,
        networkInterfaces,
      },
    },
    {
      upsert: true,
    },
  );

  return _id;
};

export { start };
