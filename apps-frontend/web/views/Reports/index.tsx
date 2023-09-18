import dynamic from 'next/dynamic';

import Link from '~components/base/Link';
import List from '~ui/core/List';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';

const ContentSection = dynamic(() => import('~ui/layouts/ContentSection'));

function Reports() {
  return (
    <ContentSection>
      <Stack py={50}>
        <Title ta="center">Our Reports</Title>
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
    </ContentSection>
  );
}

export default Reports;
