import { sendDiscord, sendSlack } from '..';

const getDefaultChannel = () => {
  if (process.env.NODE_ENV === 'staging') return `${process.env.TYPE_PRE}-staging`;
  if (process.env.NODE_ENV === 'test') return `${process.env.TYPE_PRE}-test`;
  return `${process.env.TYPE_PRE}-${process.env.TYPE_ID}`;
};

const defaultChannel = getDefaultChannel();

export const sendNotif = async (
  summary: string,
  details: string[] = [],
  channel: string = defaultChannel,
) => {
  await Promise.all([
    sendDiscord(summary, details, channel),
    sendSlack(summary, details, channel),
  ]);
};
