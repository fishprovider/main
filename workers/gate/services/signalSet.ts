import { sendDiscord } from '@fishprovider/core/dist/libs/notif';
import { start as startQueue } from '@fishprovider/core/dist/libs/queuePromise';
import delay from '@fishprovider/utils/dist/helpers/delay';
import _ from 'lodash';
import moment from 'moment-timezone';

import { sendMessage as sendTele } from '~libs/teleSignals';

const env = {
  apiPass: process.env.API_PASS,
  discordWebhookId: process.env.DISCORD_WEBHOOK_ID_SIGNALS || '',
  discordWebhookToken: process.env.DISCORD_WEBHOOK_TOKEN_SIGNALS || '',
};

const pQueueDiscord = startQueue({
  name: 'signalSet',
  concurrency: 1,
});

const pQueueTelegram = startQueue({
  name: 'signalSet',
  concurrency: 1,
});

const signals: Record<string, Record<string, any>> = {
  // AUDUSD: {
  //   Hour4: {
  //     timeFr: 'Hour4', score: 6, currentPrice: 1.123, openTime: '2022-01-01 00:00:00',
  //   },
  //   Hour: {
  //     timeFr: 'Hour', score: -3, currentPrice: 0.123, openTime: '2021-01-01 00:00:00',
  //   },
  // },
};

const parseTimeFr = (timeFr: string) => {
  if (timeFr === 'Hour') return 'H1';
  if (timeFr === 'Hour4') return 'H4';
  if (timeFr === 'Daily') return 'D1';
  if (timeFr === 'Weekly') return 'W1';
  return timeFr;
};

const parseScoreSymbols = (score: number, symbol: string) => _.range(score).map(() => symbol).join('');

const parseScore = (score: number) => {
  if (score >= 6) return `Strong Buy ${parseScoreSymbols(score, '🟢')}`;
  if (score >= 3) return `Buy ${parseScoreSymbols(score, '🟢')}`;
  if (score >= 1) return `Weak Buy ${parseScoreSymbols(score, '🟢')}`;
  if (score === 0) return 'Neutral ⚪';
  if (score >= -2) return `Weak Sell ${parseScoreSymbols(score, '🔴')}`;
  if (score >= -5) return `Sell ${parseScoreSymbols(score, '🔴')}`;
  return `Strong Sell ${parseScoreSymbols(score, '🔴')}`;
};

const parseTime = (time: Date) => `${moment.tz(time, 'UTC').format('YYYY-MM-DD HH:mm:ss')} UTC+0`;

const buildMsg = (symbolName: string, timeFr: string) => {
  const { score, currentPrice, openTime } = _.get(signals, [symbolName, timeFr], {});

  const scoreMsg = parseScore(+score);
  const timeFrMsg = parseTimeFr(timeFr);
  const timeMsg = parseTime(openTime);

  return {
    html: `[<u>${timeFrMsg}</u>] <b>${scoreMsg}</b> at ${currentPrice} (${timeMsg})`,
    md: `[${timeFrMsg}] ${scoreMsg} at ${currentPrice} (${timeMsg})`,
  };
};

// const buildMsgs = (symbolName: string) => _.map(
//   _.sortBy(signals[symbolName], ({ timeFr }) => {
//     if (timeFr === 'Hour') return 0;
//     if (timeFr === 'Hour4') return 1;
//     if (timeFr === 'Daily') return 2;
//     if (timeFr === 'Weekly') return 3;
//     return 4;
//   }),
//   ({ timeFr }) => buildMsg(symbolName, timeFr),
// );

const sendNotif = async (symbolName: string, timeFr: string) => {
  const msg = buildMsg(symbolName, timeFr);

  const sendDiscordRes = sendDiscord([symbolName, msg.md].join(' '), undefined, '', env.discordWebhookId, env.discordWebhookToken, '').catch((err) => {
    Logger.error('Failed at sendDiscord', err);
  });
  const sendTeleRes = sendTele([symbolName, msg.html].join(' ')).catch((err) => {
    Logger.error('Failed at sendTele', err);
  });

  const queueDiscord = await pQueueDiscord;
  queueDiscord.add(() => Promise.all([sendDiscordRes, delay(1000)]));

  const queueTelegram = await pQueueTelegram;
  queueTelegram.add(() => Promise.all([sendTeleRes, delay(5000)]));
};

const signalSet = async ({
  secret,
  direction,
  symbolName,
  pattern,
  timeFr,
  currentPrice,
  openTime: openTimeRaw,
}: {
  secret: string;
  direction: string;
  symbolName: string;
  pattern: string;
  timeFr: string;
  currentPrice: number;
  openTime: string;
}) => {
  if (secret !== env.apiPass) {
    return { error: 'Params error' };
  }

  const openTime = moment.tz(openTimeRaw, 'UTC').toDate();

  await Mongo.collection('signals').updateOne(
    {
      direction,
      symbolName,
      pattern,
      timeFr,
      openTime,
    },
    {
      $set: {
        direction,
        symbolName,
        pattern,
        timeFr,
        openTime,
        currentPrice,
        createdAt: new Date(),
      },
    },
    {
      upsert: true,
    },
  );

  const [, score = 0] = pattern.split('_');
  _.set(signals, [symbolName, timeFr], {
    timeFr, score, currentPrice, openTime,
  });

  await sendNotif(symbolName, timeFr);

  return { result: 'OK' };
};

export default signalSet;

export {
  sendNotif,
};
