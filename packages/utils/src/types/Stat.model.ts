import type { Account } from '~types/Account.model';

interface Stat extends Record<string, any> {
  _id: string,
  type: string,
  typeId: string,

  // trends
  symbol?: string,
  h1?: string,
  h4?: string,
  d1?: string,

  // keyLevels
  // symbol?: string,
  timeFr?: string,
  keyLevels?: number[],

  // dailyBalance
  year?: number,
  dayOfYear?: number,
  account?: Account

  // dailyFunding
  ver?: number;
  messageId?: string;
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
  capitalDemo?: number

  createdAt?: Date,
  updatedAt?: Date,
}

export type { Stat };
