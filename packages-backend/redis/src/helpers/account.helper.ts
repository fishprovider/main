import objectHash from 'object-hash';

export const buildKeyAccount = (filter: any) => `fp-account:${objectHash(filter)}`;

export const buildKeyAccounts = (filter: any) => `fp-accounts:${objectHash(filter)}`;
