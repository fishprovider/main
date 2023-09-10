import { send } from '@fishprovider/old-core/dist/libs/notif';
import fs from 'fs';

import restartProcess from '~services/restartProcess';

const env = {
  typeId: process.env.TYPE_ID,
  slackToken: process.env.SLACK_TOKEN,
  discordWebhookId: process.env.DISCORD_WEBHOOK_ID,
  discordWebhookToken: process.env.DISCORD_WEBHOOK_TOKEN,
  heartbeatFile: process.env.HEARTBEAT_FILE,
  notifChannelError: process.env.NOTIF_CHANNEL_ERROR || `${process.env.TYPE_PRE}-errors`,
};

const heartbeatFile = env.heartbeatFile || `./immortal-${env.typeId}.js`;

const timeoutMS = 1000 * 30;

let lastNoti = 0;
let lostHeartbeatCount = 0;

const errorNoti = (msg: string) => {
  console.error(msg);
  send(msg);
  send(`[fp-${env.typeId}] ${msg} @here`, [], env.notifChannelError);
};

const watchMon = () => {
  try {
    if (!lastNoti || Date.now() - lastNoti > 1000 * 3600 * 4) {
      console.log(`[I] Uptime: ${Math.round(process.uptime() / 3600)} hours`);
      lastNoti = Date.now();
    }

    const data = fs.readFileSync(heartbeatFile, 'utf8');
    const heartbeat = data.split(' ')[2] || 0;
    const range = Date.now() - +heartbeat;
    if (range < timeoutMS) {
      lostHeartbeatCount = 0;
    } else {
      errorNoti(`🔥🔥 Lost heartbeat of ${env.typeId} since ${heartbeat}`);

      const count = lostHeartbeatCount;
      if (count < 10) {
        lostHeartbeatCount += 1;
      } else {
        lostHeartbeatCount = 0;

        if (count === 10) {
          errorNoti(`🔥🔥🔥 Lost heartbeat too many times, restarting... ${env.typeId}`);
          restartProcess('mon');
        }
      }
    }
  } catch (err: any) {
    console.log(err);
    errorNoti(`🔥🔥 Failed to read heartbeat of ${env.typeId}: ${err.message}`);
  }

  setTimeout(watchMon, 5000);
};

console.log(`Watching ${env.typeId}`);
setTimeout(watchMon, 5000);
