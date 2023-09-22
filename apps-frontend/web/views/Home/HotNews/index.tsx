import Link from '~components/base/Link';
import { NotionPage, NotionPageProps } from '~components/view/NotionPage';
import { notionPages } from '~constants/view';
import Routes from '~libs/routes';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';

function HotNews({ recordMap, pageId }: NotionPageProps) {
  return (
    <Stack id="hot-news" py={50}>
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
      <Group position="center">
        <Link href={Routes.news} variant="clean">
          <Button size="md">See All ➜</Button>
        </Link>
      </Group>
    </Stack>
  );
}

export default HotNews;
