import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserController = dynamic(() => import('~providers/UserController'), {
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
      <UserController title="Accounts">
        <Accounts />
      </UserController>
    </>
  );
}

export default AccountsPage;
