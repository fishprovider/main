import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserController = dynamic(() => import('~providers/UserController'), {
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
      <UserController title="Withdraw">
        <WalletLayout>
          <Withdraw />
        </WalletLayout>
      </UserController>
    </>
  );
}

export default WithdrawPage;
