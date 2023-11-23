import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserProvider = dynamic(() => import('~providers/UserProvider'), {
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
      <UserProvider title="Import CTrader Accounts">
        <CTraderAuth />
      </UserProvider>
    </>
  );
}

export default CTraderAuthPage;
