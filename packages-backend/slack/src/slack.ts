import { log } from '@fishprovider/core';
import axios from 'axios';

const sendSlackWebhook = async (
  summary: string,
  details: string[],
  channel: string,
) => {
  if (!process.env.SLACK_WEBHOOK) return;

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

  await axios.post(`https://hooks.slack.com/services/${process.env.SLACK_WEBHOOK}`, payload, { headers })
    .catch(() => axios.post(`https://hooks.slack.com/services/${process.env.SLACK_WEBHOOK}`, {
      text: `[${payload.channel}] ${payload.text}`,
      blocks: payload.blocks,
    }, { headers }));
};

const sendSlackApi = async (
  summary: string,
  details: string[],
  channel: string,
) => {
  if (!process.env.SLACK_TOKEN) return;

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
    Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
  };

  await axios.post('https://slack.com/api/chat.postMessage', payload, { headers });
};

export const sendSlack = (
  summary: string,
  details: string[],
  channel: string,
) => Promise.all([
  sendSlackWebhook(summary, details, channel).catch((error) => {
    log.info(`Send to Slack failed ${new Date().toLocaleString()} ${error}`);
  }),
  sendSlackApi(summary, details, channel).catch((error) => {
    log.info(`Send to SlackApi failed ${new Date().toLocaleString()} ${error}`);
  }),
]);
