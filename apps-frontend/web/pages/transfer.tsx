import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserController = dynamic(() => import('~providers/UserController'), {
  loading: () => <Loading />,
});
const WalletLayout = dynamic(() => import('~layouts/WalletLayout'), {
  loading: () => <Loading />,
});
const Transfer = dynamic(() => import('~views/Transfer'), {
  loading: () => <Loading />,
});

function TransferPage() {
  return (
    <>
      <Head>
        <title>Transfer</title>
        <meta name="description" content="FishProvider Transfer" />
      </Head>
      <UserController title="Transfer">
        <WalletLayout>
          <Transfer />
        </WalletLayout>
      </UserController>
    </>
  );
}

export default TransferPage;
