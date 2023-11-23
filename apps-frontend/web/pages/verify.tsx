import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserProvider = dynamic(() => import('~providers/UserProvider'), {
  loading: () => <Loading />,
});
const WalletLayout = dynamic(() => import('~layouts/WalletLayout'), {
  loading: () => <Loading />,
});
const Verify = dynamic(() => import('~views/Verify'), {
  loading: () => <Loading />,
});

function VerifyPage() {
  return (
    <>
      <Head>
        <title>Verify</title>
        <meta name="description" content="FishProvider Verify" />
      </Head>
      <UserProvider title="Verify">
        <WalletLayout>
          <Verify />
        </WalletLayout>
      </UserProvider>
    </>
  );
}

export default VerifyPage;
