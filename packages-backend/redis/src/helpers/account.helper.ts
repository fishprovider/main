import { AccountViewType } from '@fishprovider/core';
import hash from 'object-hash';

export const buildKeyAccount = (filter: {
  accountId?: string,
}) => `fp-account:${hash(filter)}`;

export const buildKeyAccounts = (filter: {
  accountViewType?: AccountViewType,
  email?: string,
}) => `fp-accounts:${hash(filter)}`;
