import { forexMajorPairs, ProviderType } from '..';

export const getMajorPairs = (providerType: ProviderType) => {
  switch (providerType) {
    // TODO: handle account types
    default:
      return forexMajorPairs;
  }
};
