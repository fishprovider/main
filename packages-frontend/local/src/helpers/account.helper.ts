import _ from 'lodash';
import hash from 'object-hash';

export const buildKeyAccount = (filter: any) => `fp-account:${hash(_.compact(filter))}`;

export const buildKeyAccounts = (filter: any) => `fp-accounts:${hash(_.compact(filter))}`;
