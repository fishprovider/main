import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserProvider = dynamic(() => import('~providers/UserProvider'), {
  loading: () => <Loading />,
});
const WalletLayout = dynamic(() => import('~layouts/WalletLayout'), {
  loading: () => <Loading />,
});
const Deposit = dynamic(() => import('~views/Deposit'), {
  loading: () => <Loading />,
});

function DepositPage() {
  return (
    <>
      <Head>
        <title>Deposit</title>
        <meta name="description" content="FishProvider Deposit" />
      </Head>
      <UserProvider title="Deposit">
        <WalletLayout>
          <Deposit />
        </WalletLayout>
      </UserProvider>
    </>
  );
}

export default DepositPage;
