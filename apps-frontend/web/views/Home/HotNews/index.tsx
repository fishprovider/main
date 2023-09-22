import { NotionPage, NotionPageProps } from '~components/view/NotionPage';
import { notionPages } from '~constants/view';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';

function HotNews({ recordMap, pageId }: NotionPageProps) {
  return (
    <Stack py={50} spacing="xl">
      <Title ta="center" size="h2">
        Hot News
      </Title>
      <NotionPage
        recordMap={recordMap}
        pageId={pageId}
        rootPageId={notionPages.news.rootId}
        basePath="news"
        withMeta={false}
        withEstimateReadTime={false}
        fullPage={false}
      />
    </Stack>
  );
}

export default HotNews;
