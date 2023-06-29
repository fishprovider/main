import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserController = dynamic(() => import('~controllers/UserController'), {
  loading: () => <Loading />,
});
const WalletLayout = dynamic(() => import('~layouts/WalletLayout'), {
  loading: () => <Loading />,
});
const Invest = dynamic(() => import('~views/Invest'), {
  loading: () => <Loading />,
});

function InvestPage() {
  return (
    <>
      <Head>
        <title>Invest</title>
        <meta name="description" content="FishProvider Invest" />
      </Head>
      <UserController title="Invest">
        <WalletLayout>
          <Invest />
        </WalletLayout>
      </UserController>
    </>
  );
}

export default InvestPage;
