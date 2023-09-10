import dynamic from 'next/dynamic';

import Skeleton from '~ui/core/Skeleton';
import Stack from '~ui/core/Stack';
import ContentSection from '~ui/layouts/ContentSection';

const AccountHeader = dynamic(() => import('./AccountHeader'), { loading: () => <Skeleton height={400} /> });
const AccountContent = dynamic(() => import('./AccountContent'), { loading: () => <Skeleton height={500} /> });
const AccountFooter = dynamic(() => import('./AccountFooter'), { loading: () => <Skeleton height={400} /> });

function Provider() {
  return (
    <ContentSection>
      <Stack py="md">
        <AccountHeader />
        <AccountContent />
        <AccountFooter />
      </Stack>
    </ContentSection>
  );
}

export default Provider;
