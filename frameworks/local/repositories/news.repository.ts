import { DefaultNewsRepository, type NewsRepository } from '@fishprovider/application-rules';
import type { News } from '@fishprovider/enterprise-rules';

import { local } from '../local.framework';

async function getNews() {
  const { localGet } = await local.get();
  const docs = await localGet<News[]>('news');
  return docs;
}

export const LocalNewsRepository: NewsRepository = {
  ...DefaultNewsRepository,
  getNews,
};
