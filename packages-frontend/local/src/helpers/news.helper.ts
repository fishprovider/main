import { GetNewsFilter } from '@fishprovider/core';

export const buildNewsKeys = (filter: GetNewsFilter) => {
  const keys = Object.entries(filter).map(([key, value]) => `${key}-${value}`);
  return `news-${keys?.join('-')}`;
};
