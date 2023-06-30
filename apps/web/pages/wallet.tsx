import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserController = dynamic(() => import('~controllers/UserController'), {
  loading: () => <Loading />,
});
const WalletLayout = dynamic(() => import('~layouts/WalletLayout'), {
  loading: () => <Loading />,
});
const Wallet = dynamic(() => import('~views/Wallet'), {
  loading: () => <Loading />,
});

function WalletPage() {
  return (
    <>
      <Head>
        <title>Wallet</title>
        <meta name="description" content="FishProvider Wallet" />
      </Head>
      <UserController title="Wallet">
        <WalletLayout>
          <Wallet />
        </WalletLayout>
      </UserController>
    </>
  );
}

export default WalletPage;
