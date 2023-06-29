import type { ExtendedRecordMap } from 'notion-types';

import { NotionPage } from '~components/view/NotionPage';
import ShareSocial from '~components/view/ShareSocial';
import { notionPages } from '~constants/view';
import { getDefaultStaticPaths, getDefaultStaticProps } from '~libs/notion';

export const getStaticProps = getDefaultStaticProps(notionPages.faq.rootId);
export const getStaticPaths = getDefaultStaticPaths(notionPages.faq.rootId, 'faq');

interface Props {
  recordMap: ExtendedRecordMap
  pageId: string
}

export default function Page({ recordMap, pageId }: Props) {
  return (
    <>
      <NotionPage
        recordMap={recordMap}
        pageId={pageId}
        rootPageId={notionPages.faq.rootId}
        basePath="faq"
      />
      <ShareSocial />
    </>
  );
}
