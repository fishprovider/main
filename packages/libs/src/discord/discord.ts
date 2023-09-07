import axios from 'axios';
import {
  Client, Events, ForumChannel, GatewayIntentBits,
} from 'discord.js';

import { log } from '..';

let discordClient: Client | undefined;

export const startDiscord = () => {
  discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });
  discordClient.login(process.env.DISCORD_TOKEN);
};

const sendDiscordWebhook = async (
  summary: string,
  details: string[],
  channel: string,
  webhookId: string = process.env.DISCORD_WEBHOOK_ID || '',
  webhookToken: string = process.env.DISCORD_WEBHOOK_TOKEN || '',
  webhookThread: string = process.env.DISCORD_THREAD || '',
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
  summary: string,
  details: string[],
  channel: string,
) => {
  if (!discordClient) return;
  if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CHANNEL) return;

  await new Promise((resolve) => {
    discordClient?.once(Events.ClientReady, () => resolve(true));
  });

  const res = discordClient?.channels.cache.get(process.env.DISCORD_CHANNEL);
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

export const sendDiscord = (
  summary: string,
  details: string[],
  channel: string,
) => Promise.all([
  sendDiscordWebhook(summary, details, channel).catch((error) => {
    log.info(`Send to Discord failed ${new Date().toLocaleString()} ${error}`);
  }),
  sendDiscordForum(summary, details, channel).catch((error) => {
    log.info(`Send to DiscordForum failed ${new Date().toLocaleString()} ${error}`);
  }),
]);
