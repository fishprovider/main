import { NotionAPI } from 'notion-client';
import type { SearchParams } from 'notion-types';

const notion = new NotionAPI();

// public
const notionSearch = async ({ data }: {
  data: SearchParams
}) => {
  const result = await notion.search(data);
  return { result };
};

export default notionSearch;
