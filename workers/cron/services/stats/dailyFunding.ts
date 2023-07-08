/* eslint-disable prefer-destructuring */

import {
  createGmailClient,
  getLabels,
  getMessage,
  getMessages,
  removeLabels,
} from '@fishprovider/core/libs/gmail';
import type { gmail_v1 } from 'googleapis';
import _ from 'lodash';
import moment from 'moment';

const updateMsg = async (gmailClient: gmail_v1.Gmail, message: gmail_v1.Schema$Message) => {
  if (!message.id) {
    Logger.warn('[dailyFunding] No message.id');
    return;
  }

  const { body } = await getMessage(gmailClient, message.id);
  if (!body) {
    Logger.warn('[dailyFunding] No body');
    return;
  }
  try {
    const lines = body.split('\n');
    const res: {
      ver: number;
      messageId: string;
      action?: string;
      author?: string;
      accountAuthor?: string;
      accountType?: string;
      accountName?: string;
      dateRaw?: string;
      date?: Date;
      inAmountCurrency?: string;
      inAmount?: number;
      outAmountCurrency?: string;
      outAmount?: number;
      capitalCurrency?: string;
      capital?: number;
      capitalDemoCurrency?: string;
      capitalDemo?: number;
    } & Record<string, any> = {
      ver: 3,
      messageId: message.id,
    };

    const actionLine = lines.find((line) => line.match(/copying your strategy/))?.trim();
    if (actionLine) {
      const splits = actionLine.split('copying your strategy')[0]?.trim().split(' ');
      if (splits) {
        res.action = splits[splits.length - 1];
        res.author = splits[splits.length - 2]?.match(/>(.+)</)?.[1];
      }
    }

    const accountLine = lines.find((line) => line.match(/\d+\s*\((Demo|Live)\)/))?.trim();
    if (accountLine) {
      if (accountLine.endsWith(')')) {
        const splitsLine = accountLine.split('>');
        if (splitsLine) {
          const splits = splitsLine[splitsLine.length - 1]?.split(' ');
          if (splits) {
            res.accountAuthor = splits[0];
            res.accountType = _.trim(splits[1], '()');
          }
        }
      } else {
        const splits = accountLine.match(/>(.+)</)?.[1]?.match(/>(.+)</)?.[1]?.split(' ');
        if (splits) {
          res.accountAuthor = splits[0];
          res.accountType = _.trim(splits[1], '()');
        }
      }
    }

    const providerLineIndex = lines.findIndex((line) => line.match(/Strategy:/)) + 1;
    if (providerLineIndex) {
      const providerLine = lines.find((line) => line.match(/<strong.*\d+/), providerLineIndex);
      if (providerLine) {
        res.accountName = `${providerLine}`.match(/>(.+)</)?.[1]?.match(/>(.+)</)?.[1];
      }
    }

    const dateLine = lines.find((line) => line.match(/UTC/))?.trim();
    if (dateLine) {
      const dateRaw = dateLine.match(/>(.+)</)?.[1]?.match(/>(.+)</)?.[1]
        ?.replace(/UTC /g, 'UTC')
        .replace(/\(UTC\)/g, 'UTC +0')
        .replace(/\(/g, '')
        .replace(/\)/g, '');
      res.dateRaw = dateRaw;
      res.date = moment.utc(dateRaw, 'DD/MM/YYYY hh:mm:ss ZZ').toDate();
    }

    const inAmountLineIndex = lines.findIndex((line) => line.match(/Invested Amount/)) + 1;
    if (inAmountLineIndex) {
      const inAmountLine = lines.find((line) => line.match(/<strong.*\d+/), inAmountLineIndex);
      if (inAmountLine) {
        const splits = `${inAmountLine}`.match(/>(.+)</)?.[1]?.match(/>(.+)</)?.[1]?.split(' ');
        if (splits) {
          res.inAmountCurrency = splits[0];
          res.inAmount = +(splits[1] || 0);
        }
      }
    }

    const outAmountLineIndex = lines.findIndex((line) => line.match(/Withdrawn Amount/)) + 1;
    if (outAmountLineIndex) {
      const outAmountLine = lines.find((line) => line.match(/<strong.*\d+/), outAmountLineIndex);
      if (outAmountLine) {
        const splits = `${outAmountLine}`.match(/>(.+)</)?.[1]?.match(/>(.+)</)?.[1]?.split(' ');
        if (splits) {
          res.outAmountCurrency = splits[0];
          res.outAmount = +(splits[1] || 0);
        }
      }
    }

    const capitalLineIndex = lines.findIndex((line) => line.match(/Copying Capital \(Live\)/)) + 1;
    if (capitalLineIndex) {
      const capitalLine = lines.find((line) => line.match(/<strong.*\d+/), capitalLineIndex);
      const splits = `${capitalLine}`?.match(/>(.+)</)?.[1]?.match(/>(.+)</)?.[1]?.split(' ');
      if (splits) {
        res.capitalCurrency = splits[0];
        res.capital = +(splits[1] || 0);
      }
    }

    const capitalDemoLineIndex = lines.findIndex((line) => line.match(/Copying Capital \(Demo\)/)) + 1;
    if (capitalDemoLineIndex) {
      const capitalLine = lines.find((line) => line.match(/<strong.*\d+/), capitalDemoLineIndex);
      const splits = `${capitalLine}`?.match(/>(.+)</)?.[1]?.match(/>(.+)</)?.[1]?.split(' ');
      if (splits) {
        res.capitalDemoCurrency = splits[0];
        res.capitalDemo = +(splits[1] || 0);
      }
    }

    const validate = () => {
      if (
        [
          'messageId',
          'author',
          'action',
          'accountAuthor',
          'accountName',
          'accountType',
          'date',
          'capitalCurrency',
          'capitalDemoCurrency',
        ].some((item) => !res[item])
      ) { return false; }
      if (
        res.action === 'started'
        && (!res.inAmountCurrency || (!res.inAmount && res.inAmount !== 0))
      ) { return false; }
      if (
        res.action === 'stopped'
        && (!res.outAmountCurrency || (!res.outAmount && res.outAmount !== 0))
      ) { return false; }
      return true;
    };

    if (!validate()) {
      Logger.error('Failed to validate dailyFunding', res);
      return;
    }

    await Mongo.collection('stats').updateOne(
      { messageId: res.messageId },
      {
        $set: {
          ...res,
          type: 'dailyFunding',
          typeId: `${res.accountAuthor}-${res.accountName}`,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );
    await removeLabels(gmailClient, message.id, ['UNREAD']);
    Logger.debug(res);
  } catch (error) {
    Logger.error('Failed to parse dailyFunding', error);
  }
};

const dailyFunding = async () => {
  try {
    const gmailClient = await createGmailClient(['https://www.googleapis.com/auth/gmail.modify']);
    const { labels } = await getLabels(gmailClient);
    if (!labels) {
      Logger.warn('[dailyFunding] No labels');
      return;
    }

    const UnreadLabelId = labels.find((label) => label.name === 'UNREAD')?.id;
    const CopyLabelId = labels.find((label) => label.name === 'Copy')?.id;
    const labelIds = [];
    if (UnreadLabelId) { labelIds.push(UnreadLabelId); }
    if (CopyLabelId) { labelIds.push(CopyLabelId); }
    const { messages } = await getMessages(gmailClient, labelIds);
    if (!messages) {
      Logger.warn('[dailyFunding] No email');
      return;
    }

    Logger.warn(`[dailyFunding] Found ${messages.length} emails`);
    for (const message of messages) {
      await updateMsg(gmailClient, message);
    }
    Logger.debug('[dailyFunding] Done');
  } catch (err) {
    Logger.error('Failed in dailyFunding', err);
  }
};

export default dailyFunding;
