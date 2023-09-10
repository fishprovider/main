import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserController = dynamic(() => import('~controllers/UserController'), {
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
      <UserController title="Deposit">
        <WalletLayout>
          <Deposit />
        </WalletLayout>
      </UserController>
    </>
  );
}

export default DepositPage;
