import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserController = dynamic(() => import('~providers/UserController'), {
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
      <UserController title="Open Account">
        <AccountOpen />
      </UserController>
    </>
  );
}

export default AccountOpenPage;
