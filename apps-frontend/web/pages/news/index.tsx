import Link from '~components/base/Link';
import { NotionPage, NotionPageProps } from '~components/view/NotionPage';
import { notionPages } from '~constants/view';
import { getDefaultStaticProps } from '~libs/notion';
import Routes from '~libs/routes';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';

export const getStaticProps = getDefaultStaticProps(notionPages.news.rootId);

export default function Page({ recordMap, pageId }: NotionPageProps) {
  return (
    <Stack pb="xl">
      <NotionPage
        recordMap={recordMap}
        pageId={pageId}
        rootPageId={notionPages.news.rootId}
        basePath="news"
        withEstimateReadTime={false}
      />
      <Group position="center">
        <Link href={Routes.allNews} variant="clean">
          <Button size="md">See All ➜</Button>
        </Link>
      </Group>
    </Stack>
  );
}
