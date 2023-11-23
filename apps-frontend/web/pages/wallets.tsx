import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserProvider = dynamic(() => import('~providers/UserProvider'), {
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
      <UserProvider title="Wallets">
        <WalletLayout>
          <Wallets />
        </WalletLayout>
      </UserProvider>
    </>
  );
}

export default WalletsPage;
