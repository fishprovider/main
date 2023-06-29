import dynamic from 'next/dynamic';

import Skeleton from '~ui/core/Skeleton';
import Stack from '~ui/core/Stack';
import ContentSection from '~ui/layouts/ContentSection';

const ProviderHeader = dynamic(() => import('./ProviderHeader'), { loading: () => <Skeleton height={400} /> });
const ProviderContent = dynamic(() => import('./ProviderContent'), { loading: () => <Skeleton height={400} /> });
const ProviderFooter = dynamic(() => import('./ProviderFooter'), { loading: () => <Skeleton height={400} /> });

function Strategy() {
  return (
    <ContentSection>
      <Stack py="md">
        <ProviderHeader />
        <ProviderContent />
        <ProviderFooter />
      </Stack>
    </ContentSection>
  );
}

export default Strategy;
