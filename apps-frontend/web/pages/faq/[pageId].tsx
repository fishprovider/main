import { NotionPage, NotionPageProps } from '~components/view/NotionPage';
import ShareSocial from '~components/view/ShareSocial';
import { notionPages } from '~constants/view';
import { getDefaultStaticPaths, getDefaultStaticProps } from '~libs/notion';

export const getStaticProps = getDefaultStaticProps(notionPages.faq.rootId);
export const getStaticPaths = getDefaultStaticPaths(notionPages.faq.rootId, 'faq');

export default function Page({ recordMap, pageId }: NotionPageProps) {
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
