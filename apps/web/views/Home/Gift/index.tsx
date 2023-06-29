import dynamic from 'next/dynamic';

import Stack from '~ui/core/Stack';

const Signals = dynamic(() => import('./Signals'));

function Gift() {
  return (
    <Stack py={50} spacing="xl">
      <Signals />
    </Stack>
  );
}

export default Gift;
