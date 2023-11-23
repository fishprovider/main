import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserController = dynamic(() => import('~providers/UserController'), {
  loading: () => <Loading />,
});
const User = dynamic(() => import('~views/User'), {
  loading: () => <Loading />,
});

function UserPage() {
  return (
    <>
      <Head>
        <title>User</title>
        <meta name="description" content="FishProvider User" />
      </Head>
      <UserController title="User">
        <User />
      </UserController>
    </>
  );
}

export default UserPage;
