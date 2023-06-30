import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserController = dynamic(() => import('~controllers/UserController'), {
  loading: () => <Loading />,
});
const WalletLayout = dynamic(() => import('~layouts/WalletLayout'), {
  loading: () => <Loading />,
});
const Swap = dynamic(() => import('~views/Swap'), {
  loading: () => <Loading />,
});

function SwapPage() {
  return (
    <>
      <Head>
        <title>Swap</title>
        <meta name="description" content="FishProvider Swap" />
      </Head>
      <UserController title="Swap">
        <WalletLayout>
          <Swap />
        </WalletLayout>
      </UserController>
    </>
  );
}

export default SwapPage;
