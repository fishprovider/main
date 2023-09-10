import dynamic from 'next/dynamic';

import Loading from '~ui/core/Loading';
import Stack from '~ui/core/Stack';

const Wallet = dynamic(() => import('~views/Wallet'), {
  loading: () => <Loading />,
});
const Invest = dynamic(() => import('~views/Invest'), {
  loading: () => <Loading />,
});

function Wallets() {
  return (
    <Stack spacing="xl">
      <Wallet />
      <Invest />
    </Stack>
  );
}

export default Wallets;
