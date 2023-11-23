import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserProvider = dynamic(() => import('~providers/UserProvider'), {
  loading: () => <Loading />,
});
const AccountOpen = dynamic(() => import('~views/AccountOpen'), {
  loading: () => <Loading />,
});

function AccountOpenPage() {
  return (
    <>
      <Head>
        <title>Account Open</title>
        <meta name="description" content="FishProvider Account Open" />
      </Head>
      <UserProvider title="Open Account">
        <AccountOpen />
      </UserProvider>
    </>
  );
}

export default AccountOpenPage;
