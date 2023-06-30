import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserController = dynamic(() => import('~controllers/UserController'), {
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
      <UserController title="Verify">
        <WalletLayout>
          <Verify />
        </WalletLayout>
      </UserController>
    </>
  );
}

export default VerifyPage;
