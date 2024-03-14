import { NotionPage, NotionPageProps } from '~components/view/NotionPage';
import { notionPages } from '~constants/view';
import { getDefaultStaticProps } from '~libs/notion';

export const getStaticProps = getDefaultStaticProps(notionPages.allNews.rootId);

export default function Page({ recordMap, pageId }: NotionPageProps) {
  return (
    <NotionPage
      recordMap={recordMap}
      pageId={pageId}
      rootPageId={notionPages.allNews.rootId}
      basePath="all-news"
      withEstimateReadTime={false}
    />
  );
}
