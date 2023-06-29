import dynamic from 'next/dynamic';

import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';

const KYC = dynamic(() => import('./KYC'), {
  ssr: false,
});

function Verify() {
  return (
    <Stack py="xs">
      <Group>
        <Title>Verify</Title>
      </Group>
      <KYC />
    </Stack>
  );
}

export default Verify;
