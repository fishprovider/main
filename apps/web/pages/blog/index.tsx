import type { ExtendedRecordMap } from 'notion-types';

import { NotionPage } from '~components/view/NotionPage';
import { notionPages } from '~constants/view';
import { getDefaultStaticProps } from '~libs/notion';

export const getStaticProps = getDefaultStaticProps(notionPages.blog.rootId);

interface Props {
  recordMap: ExtendedRecordMap
  pageId: string
}

export default function Page({ recordMap, pageId }: Props) {
  return (
    <NotionPage
      recordMap={recordMap}
      pageId={pageId}
      rootPageId={notionPages.blog.rootId}
      basePath="blog"
    />
  );
}
