import axios from 'axios';
import {
  Client, Events, ForumChannel, GatewayIntentBits,
} from 'discord.js';

import { log } from '..';

const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });

if (process.env.DISCORD_TOKEN) {
  discordClient.login(process.env.DISCORD_TOKEN);
}

const sendDiscordWebhook = async (
  summary: string,
  details: string[],
  channel: string,
) => {
  if (!process.env.DISCORD_WEBHOOK_ID || !process.env.DISCORD_WEBHOOK_TOKEN) {
    log.warn('Require DISCORD_WEBHOOK_ID, DISCORD_WEBHOOK_TOKEN');
    return;
  }

  const message = {
    content: `${channel ? `[${channel}] ` : ''}${summary}`,
    embeds: details.map((detail) => ({
      description: detail,
    })),
  };

  await axios.post(`https://discord.com/api/webhooks/${process.env.DISCORD_WEBHOOK_ID}/${process.env.DISCORD_WEBHOOK_TOKEN}${process.env.DISCORD_THREAD ? `?thread_id=${process.env.DISCORD_THREAD}` : ''}`, message);
};

const sendDiscordForum = async (
  summary: string,
  details: string[],
  channel: string,
) => {
  if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CHANNEL) {
    log.warn('Require DISCORD_TOKEN, DISCORD_CHANNEL');
    return;
  }

  await new Promise((resolve) => {
    discordClient?.once(Events.ClientReady, () => resolve(true));
  });

  const res = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL);
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
