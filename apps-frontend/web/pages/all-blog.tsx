import { NotionPage, NotionPageProps } from '~components/view/NotionPage';
import { notionPages } from '~constants/view';
import { getDefaultStaticProps } from '~libs/notion';

export const getStaticProps = getDefaultStaticProps(notionPages.allBlog.rootId);

export default function Page({ recordMap, pageId }: NotionPageProps) {
  return (
    <NotionPage
      recordMap={recordMap}
      pageId={pageId}
      rootPageId={notionPages.blog.rootId}
      basePath="blog"
      withEstimateReadTime={false}
    />
  );
}
