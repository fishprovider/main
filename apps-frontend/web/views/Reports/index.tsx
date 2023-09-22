import { NotionPage, NotionPageProps } from '~components/view/NotionPage';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

const notionPadding = 'calc(min(96px, 8vw))';

function Reports({ recordMap, pageId }: NotionPageProps) {
  return (
    <Stack py={50}>
      <Title ta="center">Our Reports</Title>
      <Text ta="center">
        The premier destination for monitoring the monthly ROI of
        all FishProvider strategies
      </Text>
      <Stack spacing={50}>
        <Stack px={notionPadding}>
          <Title size="h3">
            Latest Trading Updates
          </Title>
          <iframe
            title="Latest Updates"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT2MMZ7_4sKvladbKo9Ktzq1cU_Cz4VNqQjj5bAT05KPXNbvCLqusA6k6zTyrTw53lUtsr9JUTUl27b/pubhtml?gid=1616141404&amp;single=true&amp;widget=true&amp;headers=false"
            height={400}
            style={{ border: 0 }}
          />
        </Stack>
        <Stack spacing="xs">
          <Title size="h3" px={notionPadding}>
            Monthly Trading Reports
          </Title>
          <NotionPage
            recordMap={recordMap}
            pageId={pageId}
            withMeta={false}
            withEstimateReadTime={false}
            fullPage={false}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Reports;
