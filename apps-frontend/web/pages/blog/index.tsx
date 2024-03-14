import Link from '~components/base/Link';
import { NotionPage, NotionPageProps } from '~components/view/NotionPage';
import { notionPages } from '~constants/view';
import { getDefaultStaticProps } from '~libs/notion';
import Routes from '~libs/routes';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';

export const getStaticProps = getDefaultStaticProps(notionPages.blog.rootId);

export default function Page({ recordMap, pageId }: NotionPageProps) {
  return (
    <Stack pb="xl">
      <NotionPage
        recordMap={recordMap}
        pageId={pageId}
        rootPageId={notionPages.blog.rootId}
        basePath="blog"
        withEstimateReadTime={false}
      />
      <Group position="center">
        <Link href={Routes.allBlog} variant="clean">
          <Button size="md">See All ➜</Button>
        </Link>
      </Group>
    </Stack>
  );
}
