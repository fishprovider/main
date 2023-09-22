import dynamic from 'next/dynamic';

import Link from '~components/base/Link';
import List from '~ui/core/List';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';

const ContentSection = dynamic(() => import('~ui/layouts/ContentSection'));

function Reports() {
  return (
    <ContentSection>
      <Stack py={50} spacing={50}>
        <Stack>
          <Title ta="center">Our Reports</Title>
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
        <Stack>
          <Title size="h3">
            Monthly Trading Reports
          </Title>
          <List>
            <List.Item>
              Trading Report - September 2023 (Coming soon...)
            </List.Item>
            <List.Item>
              <Link
                variant="noColor"
                href="/reports/Trading-Report-2023-08.pdf"
                target="_blank"
              >
                Trading Report - August 2023
              </Link>
            </List.Item>
          </List>
        </Stack>
      </Stack>
    </ContentSection>
  );
}

export default Reports;
