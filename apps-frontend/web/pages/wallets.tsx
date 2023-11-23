import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserController = dynamic(() => import('~providers/UserController'), {
  loading: () => <Loading />,
});
const WalletLayout = dynamic(() => import('~layouts/WalletLayout'), {
  loading: () => <Loading />,
});
const Wallets = dynamic(() => import('~views/Wallets'), {
  loading: () => <Loading />,
});

function WalletsPage() {
  return (
    <>
      <Head>
        <title>Wallets</title>
        <meta name="description" content="FishProvider Wallets" />
      </Head>
      <UserController title="Wallets">
        <WalletLayout>
          <Wallets />
        </WalletLayout>
      </UserController>
    </>
  );
}

export default WalletsPage;
