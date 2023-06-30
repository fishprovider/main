import dynamic from 'next/dynamic';

import Stack from '~ui/core/Stack';
import ContentSection from '~ui/layouts/ContentSection';

const Connect = dynamic(() => import('./Connect'));
const Platforms = dynamic(() => import('./Platforms'));

function CopyTrade() {
  return (
    <ContentSection>
      <Stack py={50} spacing="xl">
        <Connect />
        <Platforms />
      </Stack>
    </ContentSection>
  );
}

export default CopyTrade;
