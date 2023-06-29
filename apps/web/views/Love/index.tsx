import dynamic from 'next/dynamic';

import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';

const ContentSection = dynamic(() => import('~ui/layouts/ContentSection'));

function Love() {
  return (
    <ContentSection>
      <Stack py={50} align="center">
        <Title ta="center">Established Non-profit Organizations</Title>
        <Image
          src="/icons/coming-soon.jpg"
          alt="coming-soon"
          radius="lg"
          width="100%"
          height={180}
          sx={{ maxWidth: 180 }}
        />
      </Stack>
    </ContentSection>
  );
}

export default Love;
