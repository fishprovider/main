import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserProvider = dynamic(() => import('~providers/UserProvider'), {
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
      <UserProvider title="User">
        <User />
      </UserProvider>
    </>
  );
}

export default UserPage;
