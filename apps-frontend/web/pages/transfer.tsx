import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserProvider = dynamic(() => import('~providers/UserProvider'), {
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
      <UserProvider title="Transfer">
        <WalletLayout>
          <Transfer />
        </WalletLayout>
      </UserProvider>
    </>
  );
}

export default TransferPage;
