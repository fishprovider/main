import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserController = dynamic(() => import('~providers/UserController'), {
  loading: () => <Loading />,
});
const CTraderAuth = dynamic(() => import('~views/CTraderAuth'), {
  loading: () => <Loading />,
});

function CTraderAuthPage() {
  return (
    <>
      <Head>
        <title>CTrader Auth</title>
        <meta name="description" content="FishProvider CTrader Auth" />
      </Head>
      <UserController title="Import CTrader Accounts">
        <CTraderAuth />
      </UserController>
    </>
  );
}

export default CTraderAuthPage;
