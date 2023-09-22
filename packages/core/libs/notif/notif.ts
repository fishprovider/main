import axios from 'axios';
import {
  Client, Events, ForumChannel, GatewayIntentBits,
} from 'discord.js';

import { push as pushExpoServer } from '~libs/expoServer';
import { push as pushFirebase } from '~libs/firebase';

const env = {
  nodeEnv: process.env.NODE_ENV,
  typeId: process.env.TYPE_ID,
  typePre: process.env.TYPE_PRE,
  slackToken: process.env.SLACK_TOKEN,
  slackWebhook: process.env.SLACK_WEBHOOK,
  discordToken: process.env.DISCORD_TOKEN,
  discordChannel: process.env.DISCORD_CHANNEL,
  discordWebhookId: process.env.DISCORD_WEBHOOK_ID || '',
  discordWebhookToken: process.env.DISCORD_WEBHOOK_TOKEN || '',
  discordWebhookThread: process.env.DISCORD_THREAD || '',
};

const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });
if (env.discordToken) {
  discordClient.login(env.discordToken).catch((err) => {
    Logger.error('Failed to login Discord', err);
  });
}

const getDefaultChannel = () => {
  if (env.nodeEnv === 'staging') return `${env.typePre}-staging`;
  if (env.nodeEnv === 'test') return `${env.typePre}-test`;
  return `${env.typePre}-${env.typeId}`;
};

const defaultChannel = getDefaultChannel();

const sendSlack = async (
  summary = '',
  details: string[] = [],
  channel: string = defaultChannel,
) => {
  if (!env.slackWebhook) return;

  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: summary,
      },
    },
  ];

  details.forEach((detail) => {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: detail,
      },
    });
  });

  const payload = {
    channel: channel.startsWith('#') ? channel : `#${channel}`,
    text: summary,
    blocks,
  };

  const headers = {
    'Content-Type': 'application/json',
  };

  await axios.post(`https://hooks.slack.com/services/${env.slackWebhook}`, payload, { headers })
    .catch(() => axios.post(`https://hooks.slack.com/services/${env.slackWebhook}`, {
      text: `[${payload.channel}] ${payload.text}`,
      blocks: payload.blocks,
    }, { headers }));
};

const sendSlackApi = async (
  summary = '',
  details: string[] = [],
  channel: string = defaultChannel,
) => {
  if (!env.slackToken) return;

  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: summary,
      },
    },
  ];

  details.forEach((detail) => {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: detail,
      },
    });
  });

  const payload = {
    channel: channel.startsWith('#') ? channel : `#${channel}`,
    text: summary,
    blocks,
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${env.slackToken}`,
  };

  await axios.post('https://slack.com/api/chat.postMessage', payload, { headers });
};

const sendDiscord = async (
  summary = '',
  details: string[] = [],
  channel: string = defaultChannel,
  webhookId: string = env.discordWebhookId,
  webhookToken: string = env.discordWebhookToken,
  webhookThread: string = env.discordWebhookThread,
) => {
  const message = {
    content: `${channel ? `[${channel}] ` : ''}${summary}`,
    embeds: details.map((detail) => ({
      description: detail,
    })),
  };

  await axios.post(`https://discord.com/api/webhooks/${webhookId}/${webhookToken}${webhookThread ? `?thread_id=${webhookThread}` : ''}`, message);
};

const sendDiscordForum = async (
  summary = '',
  details: string[] = [],
  channel: string = defaultChannel,
) => {
  if (!env.discordToken || !env.discordChannel) return;

  await new Promise((resolve) => {
    discordClient.once(Events.ClientReady, () => resolve(true));
  });

  const res = discordClient.channels.cache.get(env.discordChannel);
  if (!res) return;

  const forum = res as ForumChannel;

  const threadName = channel.startsWith('#') ? channel : `#${channel}`;
  const thread = forum.threads.cache.find((item) => item.name === threadName);

  const message = {
    content: summary,
    embeds: details.map((detail) => ({
      description: detail,
    })),
  };

  if (!thread) {
    await forum.threads.create({
      name: threadName,
      message,
    });
  } else {
    thread.send(message);
  }
};

const send = (
  summary: string,
  details: string[] = [],
  channel: string = defaultChannel,
) => Promise.all([
  sendSlack(summary, details, channel).catch((error) => {
    Logger.info(`Send to Slack failed ${new Date().toLocaleString()} ${error}`);
  }),
  sendSlackApi(summary, details, channel).catch((error) => {
    Logger.info(`Send to SlackApi failed ${new Date().toLocaleString()} ${error}`);
  }),
  sendDiscord(summary, details, channel).catch((error) => {
    Logger.info(`Send to Discord failed ${new Date().toLocaleString()} ${error}`);
  }),
  sendDiscordForum(summary, details, channel).catch((error) => {
    Logger.info(`Send to DiscordForum failed ${new Date().toLocaleString()} ${error}`);
  }),
]);

const push = async (
  notification: { title: string, body: string },
  topic = 'allDevices',
) => {
  await Promise.all([
    pushFirebase(notification, topic),
    pushExpoServer(notification, topic),
  ]);
};

export { push, send, sendDiscord };
