import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserProvider = dynamic(() => import('~providers/UserProvider'), {
  loading: () => <Loading />,
});
const Accounts = dynamic(() => import('~views/Accounts'), {
  loading: () => <Loading />,
});

function AccountsPage() {
  return (
    <>
      <Head>
        <title>Accounts</title>
        <meta name="description" content="FishProvider Accounts" />
      </Head>
      <UserProvider title="Accounts">
        <Accounts />
      </UserProvider>
    </>
  );
}

export default AccountsPage;
