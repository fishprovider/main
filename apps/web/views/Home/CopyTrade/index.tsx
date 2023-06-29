import dynamic from 'next/dynamic';

import Stack from '~ui/core/Stack';

const Connect = dynamic(() => import('./Connect'));
const Platforms = dynamic(() => import('./Platforms'));

function CopyTrade() {
  return (
    <Stack id="platforms" py={50} spacing="xl">
      <Connect />
      <Platforms />
    </Stack>
  );
}

export default CopyTrade;
