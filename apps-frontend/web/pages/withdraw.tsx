import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserProvider = dynamic(() => import('~providers/UserProvider'), {
  loading: () => <Loading />,
});
const WalletLayout = dynamic(() => import('~layouts/WalletLayout'), {
  loading: () => <Loading />,
});
const Withdraw = dynamic(() => import('~views/Withdraw'), {
  loading: () => <Loading />,
});

function WithdrawPage() {
  return (
    <>
      <Head>
        <title>Withdraw</title>
        <meta name="description" content="FishProvider Withdraw" />
      </Head>
      <UserProvider title="Withdraw">
        <WalletLayout>
          <Withdraw />
        </WalletLayout>
      </UserProvider>
    </>
  );
}

export default WithdrawPage;
