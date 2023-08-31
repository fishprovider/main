import { GetNewsFilter } from '@fishprovider/core-new';

export const buildNewsKeys = (filter: GetNewsFilter) => {
  const keys = Object.entries(filter).map(([key, value]) => `${key}-${value}`);
  return `news-${keys?.join('-')}`;
};
