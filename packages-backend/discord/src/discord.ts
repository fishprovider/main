import { log } from '@fishprovider/core';
import axios from 'axios';
import {
  Client, Events, ForumChannel, GatewayIntentBits,
} from 'discord.js';

const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });

const discordToken = process.env.DISCORD_TOKEN;
if (discordToken) {
  discordClient.login(discordToken).catch((err) => {
    log.error('Failed to login Discord', err);
  });
}

const sendDiscordWebhook = async (
  summary: string,
  details: string[],
  channel: string,
) => {
  const discordWebhookId = process.env.DISCORD_WEBHOOK_ID;
  const discordWebhookToken = process.env.DISCORD_WEBHOOK_TOKEN;
  const discordThread = process.env.DISCORD_THREAD;
  if (!discordWebhookId || !discordWebhookToken) {
    log.warn('Require DISCORD_WEBHOOK_ID, DISCORD_WEBHOOK_TOKEN');
    return;
  }

  const message = {
    content: `${channel ? `[${channel}] ` : ''}${summary}`,
    embeds: details.map((detail) => ({
      description: detail,
    })),
  };

  await axios.post(`https://discord.com/api/webhooks/${discordWebhookId}/${discordWebhookToken}${discordThread ? `?thread_id=${discordThread}` : ''}`, message);
};

const sendDiscordForum = async (
  summary: string,
  details: string[],
  channel: string,
) => {
  const discordChannel = process.env.DISCORD_CHANNEL;
  if (!discordToken || !discordChannel) {
    log.warn('Require DISCORD_TOKEN, DISCORD_CHANNEL');
    return;
  }

  await new Promise((resolve) => {
    discordClient?.once(Events.ClientReady, () => resolve(true));
  });

  const res = discordClient.channels.cache.get(discordChannel);
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
