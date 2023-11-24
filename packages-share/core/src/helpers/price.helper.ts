import { AccountType, forexMajorPairs } from '..';

export const getMajorPairs = (accountType: AccountType) => {
  switch (accountType) {
    // TODO: handle account types
    default:
      return forexMajorPairs;
  }
};
