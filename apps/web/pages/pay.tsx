import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserController = dynamic(() => import('~controllers/UserController'), {
  loading: () => <Loading />,
});
const WalletLayout = dynamic(() => import('~layouts/WalletLayout'), {
  loading: () => <Loading />,
});
const Pay = dynamic(() => import('~views/Pay'), {
  loading: () => <Loading />,
});

function PayPage() {
  return (
    <>
      <Head>
        <title>Pay</title>
        <meta name="description" content="FishPay" />
      </Head>
      <UserController title="Pay">
        <WalletLayout>
          <Pay />
        </WalletLayout>
      </UserController>
    </>
  );
}

export default PayPage;
