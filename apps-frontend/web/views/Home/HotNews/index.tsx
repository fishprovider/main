import Link from '~components/base/Link';
import { NotionPage, NotionPageProps } from '~components/view/NotionPage';
import { notionPages } from '~constants/view';
import Routes from '~libs/routes';
import Button from '~ui/core/Button';
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
      <Link href={Routes.news} variant="clean">
        <Button size="md">See All ➜</Button>
      </Link>
    </Stack>
  );
}

export default HotNews;
